(ns early-vote-site.early-vote-site-detail.events
  (:require [ajax.core :as ajax]
            [clojure.string :as str]
            [early-vote-site.election-detail.events :as election-detail]
            [early-vote-site.modal :as modal]
            [early-vote-site.server :as server]
            [early-vote-site.utils :as utils]
            [re-frame.core :as re-frame]))

;; Navigation

(defn navigate
  [{:keys [db]} [_ early-vote-site-id]]
  {:db (-> db
        (assoc :selected-early-vote-site-id early-vote-site-id)
        (assoc :active-panel :early-vote-site-detail/main))
   :dispatch-n [[:early-vote-site/get]
                [:schedules-list/get]]})

;; Early Vote Site Details

(defn get-early-vote-site
  [{:keys [db]} _]
  (let [early-vote-site-uri (server/early-vote-site-url db)]
    {:db db
     :http-xhrio {:method            :get
                  :uri               early-vote-site-uri
                  :timeout           8000
                  :format            (ajax/json-request-format)
                  :response-format   (ajax/json-response-format)
                  :on-success        [:get-early-vote-site/success]
                  :on-failure        [:get-early-vote-site/failure]}}))

(defn get-early-vote-site-success
  [db [_ result]]
  (assoc-in db [:early-vote-site-detail :early-vote-site]
         (first (map election-detail/early-vote-site-json->clj result))))

;; List Schedules

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
   :timezone (get schedule "timezone")
   :assignment-id (get schedule "assignment_id")})


(defn list-schedules-success
  [db [_ result]]
  (assoc-in db [:early-vote-site-detail :schedules]
            (map schedule-json->clj result)))

;; Edit/Create Form

(defn form-errors [form]
  (merge (when (str/blank? @(:start-date-atom form))
           {:start-date true})
         (when (str/blank? @(:end-date-atom form))
           {:end-date true})
         (when (str/blank? @(:start-time-atom form))
           {:start-time true})
         (when (str/blank? @(:end-time-atom form))
           {:end-time true})
         (when (str/blank? @(:timezone-atom form))
           {:timezone true})))

(defn save-schedule-params
  [{:keys [start-date-atom end-date-atom start-time-atom
           end-time-atom timezone-atom]}]
  {:start_date @start-date-atom
   :end_date @end-date-atom
   :start_time @start-time-atom
   :end_time @end-time-atom
   :timezone @timezone-atom})

(defn save-schedule-uri [db id]
  (if id
    (server/update-schedule-uri id)
    (server/save-new-schedule-uri db)))

(defn save-schedule
  [{:keys [db]} [_ {:keys [id] :as form}]]
  (if-let [errors (form-errors form)]
    {:db (assoc-in db [:early-vote-site-detail :errors (or id :new)] errors)}
    {:db db
     :http-xhrio {:method           (if id :put :post)
                  :uri              (save-schedule-uri db id)
                  :params           (save-schedule-params form)
                  :timeout          8000
                  :format           (ajax/json-request-format)
                  :response-format  (ajax/text-response-format)
                  :on-success       [:save-schedule/success form]
                  :on-failure       [:save-schedule/failure]}}))

(defn save-success
  [{:keys [db]} [_ form result]]
  (reset! (:start-date-atom form) (js/Date.))
  (reset! (:end-date-atom form) nil)
  (reset! (:start-time-atom form) nil)
  (reset! (:end-time-atom form) nil)
  (reset! (:timezone-atom form) nil)
  (if (nil? (:id form))
    {:db (update-in db [:early-vote-site-detail :errors] dissoc :new)
     :dispatch [:assign-schedule result]}
    {:db (update-in db [:early-vote-site-detail :errors] dissoc (:id form))
     :dispatch-n [[:schedule/end-edit (:id form)]
                  [:schedules-list/get]]}))

;; Assign Schedule

(defn assign-schedule
  [{:keys [db]} [_ schedule-id]]
  (let [assign-schedule-uri (server/assign-schedule-uri db)]
    {:db db
     :http-xhrio {:method           :post
                  :uri              assign-schedule-uri
                  :params           {:schedule_id schedule-id}
                  :timeout          8000
                  :format           (ajax/json-request-format)
                  :response-format  (ajax/json-response-format)
                  :on-success       [:assign-schedule/success]
                  :on-failure       [:assign-schedule/failure]}}))

(defn assign-schedule-success
  [{:keys [db]} [_ result]]
  {:db db
   :dispatch-n [[:flash/message "Schedule assigned"]
                [:schedules-list/get]]})

;; Unassign Schedule

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
   :dispatch-n [[:flash/message "Schedule unassigned"]
                [:schedules-list/get]]})

;; Edit Mode

(defn start-edit
  [db [_ id]]
  (update-in db [:early-vote-site-detail :editing] conj id))

(defn end-edit
  [db [_ id]]
  (update-in db [:early-vote-site-detail :editing] disj id))

;; Delete Schedule

(defn initiate-delete
  [db [_ schedule]]
  (modal/add-modal db
   {:title "Delete Schedule?"
    :message (str "Do you really want to delete the schedule "
                  (utils/schedule->string schedule) "?")
    :on-confirm #(re-frame/dispatch [:schedule/delete-schedule (:id schedule)])
    :on-cancel #(re-frame/dispatch [:close-modal])}))

(defn delete-schedule
  [{:keys [db]} [_ id]]
  {:db db
   :dispatch   [:close-modal]
   :http-xhrio {:method          :delete
                :uri             (server/update-schedule-uri id)
                :timeout         8000
                :format          (ajax/text-request-format)
                :response-format (ajax/json-response-format)
                :on-success [:schedule-delete/success]
                :on-failure [:schedule-delete/failure]}})

(defn delete-schedule-success
  [{:keys [db]} [_ early-vote-site-id]]
  {:db db
   :dispatch-n [[:flash/message "Schedule deleted"]
                [:schedules-list/get]]})

(def events
  {:db {:get-early-vote-site/success get-early-vote-site-success
        :schedules-list/success list-schedules-success
        :schedule/start-edit start-edit
        :schedule/end-edit end-edit
        :schedule/initiate-delete initiate-delete}
   :fx {:navigate/early-vote-site-detail navigate

        :early-vote-site/get get-early-vote-site
        :get-early-vote-site/failure
        (utils/flash-error-with-results "Error getting Early Vote Site")

        :schedules-list/get list-schedules
        :schedules-list/failure
        (utils/flash-error-with-results "Error loading schedules")

        :schedule-form/save save-schedule
        :save-schedule/success save-success
        :save-schedule/failure
        (utils/flash-error-with-results "Error saving new schedule")

        :assign-schedule assign-schedule
        :assign-schedule/success assign-schedule-success
        :assign-schedule/failure
        (utils/flash-error-with-results "Error assigning schedule")

        :unassign-schedule unassign-schedule
        :unassign-schedule/success unassign-schedule-success
        :unassign-schedule/failure
        (utils/flash-error-with-results "Error unassigning schedule")

        :schedule/delete-schedule delete-schedule
        :schedule-delete/success delete-schedule-success
        :schedule-delete/failure
        (utils/flash-error-with-results "Error deleting schedule")}})
