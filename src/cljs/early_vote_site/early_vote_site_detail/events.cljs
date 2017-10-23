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
                  :request-format    (ajax/json-request-format)
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
   :early-vote-site-id (get schedule "early_vote_site_id")})


(defn load-schedules-success
  [db [_ result]]
  (assoc-in db [:selected-early-vote-site-schedules] (map schedule-json->clj result)))

(defn load-schedules-failure
  [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:flash/error (str "Error loading schedules" (pr-str result))]})
