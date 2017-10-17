(ns early-vote-site.election.events
  (:require [ajax.core :as ajax]
            [re-frame.core :as re-frame]
            [clojure.string :as str]))

(re-frame/reg-event-db
 :election-form/state-selected
 (fn [db [_ new-state-selected]]
   (assoc-in db [:elections :form :state] new-state-selected)))

(re-frame/reg-event-db
 :election-form/date-selected
 (fn [db [_ new-date-selected]]
   (assoc-in db [:elections :form  :date] new-date-selected)))

(re-frame/reg-event-db
 :election-form/election-selected
 (fn [db [_ election-id]]
   (-> db
       (assoc-in [:selected-election] election-id)
       (assoc-in [:active-panel] :election/detail))))

(defn create-params [db]
  {:state_fips (get-in db [:elections :form :state])
   :election_date (get-in db [:elections :form :date])})

(re-frame/reg-event-fx
 :election-form/save
 (fn [{:keys [db]} _]
   (let [data (create-params db)]
     {:db db
      :http-xhrio {:method          :post
                   :uri             "http://localhost:4000/earlyvote/elections"
                   :params          data
                   :timeout         8000
                   :format          (ajax/json-request-format)
                   :response-format (ajax/json-response-format)
                   :on-success [:election-xhr/saved]
                   :on-failure [:election-xhr/failed]}})))

(re-frame/reg-event-db
 :election-xhr/saved
 (fn [db [_ result]]
   (re-frame/dispatch [:flash/message "Election saved"])
   (re-frame/dispatch [:elections/list-get])
   (-> db
       (assoc-in [:elections :form] {:state "" :date nil}))))

(re-frame/reg-event-db
 :election-xhr/failed
 (fn [db [_ result]]
   (re-frame/dispatch [:flash/error (str "Error saving election"
                                         (pr-str result))])))

(defn list-elections-params
  [db]
  ; eventually we'll check for a state/county level user and return fips code
  {})

(re-frame/reg-event-fx
 :elections/list-get
 (fn [{:keys [db]} _]
   (let [data (list-elections-params db)]
     {:db db
      :http-xhrio {:method          :get
                   :uri             "http://localhost:4000/earlyvote/elections"
                   :params          data
                   :timeout         8000
                   :format          (ajax/json-request-format)
                   :response-format (ajax/json-response-format)
                   :on-success [:elections/list-success]
                   :on-failure [:elections/list-fail]}})))

(defn election-json->clj
  [json]
  {:id (get json "id")
   :state-fips (get json "state_fips")
   :election-date (get json "election_date")})

(re-frame/reg-event-db
 :elections/list-success
 (fn [db [_ result]]
   (assoc-in db [:elections :list]
             (map election-json->clj result))))

(re-frame/reg-event-db
 :elections/list-fail
 (fn [db [_ result]]
   (re-frame/dispatch [:flash/error "Could not contact server for elections"])
   db))
