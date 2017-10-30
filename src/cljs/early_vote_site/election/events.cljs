(ns early-vote-site.election.events
  (:require [ajax.core :as ajax]
            [clojure.string :as str]
            [early-vote-site.db :as db]
            [early-vote-site.server :as server]
            [early-vote-site.utils :as utils]
            [re-frame.core :as re-frame]))

(defn navigate
  [{:keys [db]} [_]]
  {:db (assoc db :active-panel :election/main)
   :dispatch [:elections-list/get]})

(defn update-form [db [_ keyword newval]]
  (assoc-in db [:elections :form keyword] newval))

(defn select-election [{:keys [db]} [_ election-id]]
  {:db (assoc-in db [:selected-election-id] election-id)
   :dispatch [:navigate/election-detail]})

(defn create-params [db]
  {:state_fips (get-in db [:elections :form :state])
   :election_date (get-in db [:elections :form :date])})

(defn save-election
  [{:keys [db]} _]
  (let [data (create-params db)]
    {:db db
     :http-xhrio {:method          :post
                  :uri             (server/url "/earlyvote/elections")
                  :params          data
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :response-format (ajax/json-response-format)
                  :on-success [:election-save/success]
                  :on-failure [:election-save/failure]}}))

(defn save-election-success
  [{:keys [db]} [_ result]]
  {:db (assoc-in db [:elections :form] db/fresh-election-form)
   :dispatch-n [[:flash/message "Election saved"]
                [:elections-list/get]]})

(defn list-elections-params
  [db]
  ; eventually we'll check for a state/county level user and return fips code
  {})

(defn get-elections-list
  [{:keys [db]} _]
  (let [data (list-elections-params db)]
    {:db db
     :http-xhrio {:method          :get
                  :uri             (server/election-url db)
                  :params          data
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :response-format (ajax/json-response-format)
                  :on-success [:elections-list-get/success]
                  :on-failure [:elections-list-get/failure]}}))

(defn election-json->clj
  [json]
  {:id (get json "id")
   :state-fips (get json "state_fips")
   :election-date (get json "election_date")})

(defn get-elections-list-success
  [db [_ result]]
  (assoc-in db [:elections :list]
            (map election-json->clj result)))

(def events
  {:db {:election-form/update update-form
        :elections-list-get/success get-elections-list-success}
   :fx {:navigate/elections navigate
        :election-list/election-selected select-election
        :election-form/save save-election
        :election-save/success save-election-success
        :elections-list/get get-elections-list

        :election-save/failure
        (utils/flash-error-with-results "Error saving election")

        :elections-list-get/failure
        (utils/flash-error-with-results "Error loading election list")}})
