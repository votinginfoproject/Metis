(ns early-vote-site.early-vote-site-detail.events
  (:require [ajax.core :as ajax]
            [early-vote-site.server :as server]))

(defn navigate
  [{:keys [db]} [_ early-vote-site-id]]
  {:db (-> db
        (assoc :selected-early-vote-site-id early-vote-site-id)
        (assoc :active-panel :early-vote-site/detail))
   :dispatch [:schedules-list/get]})


(defn list-schedules
  [{:keys [db]} _]
  (let [list-uri (server/election-early-vote-site-schedules-url db)]
    {:db db
     :http-xhrio {:method            :get
                  :uri               list-uri
                  :timeout           8000
                  :format    (ajax/json-request-format)
                  :response-format   (ajax/json-response-format)
                  :on-success        [:schedules-list/success]
                  :on-failure        [:schedules-list/failure]}}))

(defn schedule-json->clj
  [schedule]
  {:id (get schedule "id")
   :start-date (get schedule "start_date")
   :end-date (get schedule "end_date")
   :start-time (get schedule "start_time")
   :end-time (get schedule "end_time")
   :assignment-id (get schedule "assignment_id")})


(defn load-schedules-success
  [db [_ result]]
  (assoc-in db [:selected-early-vote-site-schedules] (map schedule-json->clj result)))

(defn load-schedules-failure
  [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:flash/error (str "Error loading schedules" (pr-str result))]})

(defn unassign-schedule
  [{:keys [db]} [_ assignment-id]]
  (let [unassign-schedule-uri (server/unassign-schedule-uri assignment-id)]
    {:db db
     :http-xhrio {:method           :delete
                  :uri              unassign-schedule-uri
                  :timeout          8000
                  :params           {}
                  :format           (ajax/text-request-format)
                  :response-format  (ajax/json-response-format)
                  :on-success       [:unassign-schedule/success]
                  :on-failure       [:unassign-schedule/failure]}}))

(defn unassign-schedule-success
  [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:schedules-list/get]})

(defn unassign-schedule-failure
  [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:flash/error (str "Error unassigning schedule" (pr-str result))]})

(defn assign-schedule
  [{:keys [db]} [_ schedule-id]]
  (enable-console-print!)
  (let [assign-schedule-uri (server/assign-schedule-uri db)]
    {:db db
     :http-xhrio {:method           :post
                  :uri              assign-schedule-uri
                  :params           {:schedule_id schedule-id}
                  :timeout          8000
                  :format   (ajax/json-request-format)
                  :response-format  (ajax/json-response-format)
                  :on-success       [:assign-schedule/success]
                  :on-failure       [:assign-schedule/failure]}}))

(defn assign-schedule-success
  [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:schedules-list/get]})

(defn assign-schedule-failure
  [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:flash/error (str "Error assigning schedule" (pr-str result))]})

(def events
   {:fx {:unassign-schedule unassign-schedule
         :assign-schedule assign-schedule
         :unassign-schedule/success unassign-schedule-success
         :unassign-schedule/failure unassign-schedule-failure
         :assign-schedule/success assign-schedule-success
         :assign-schedule/failure assign-schedule-failure}})
