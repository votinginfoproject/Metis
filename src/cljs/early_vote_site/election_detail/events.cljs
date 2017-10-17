(ns early-vote-site.election-detail.events
  (:require [ajax.core :as ajax]
            [re-frame.core :as re-frame]
            [clojure.string :as str]))

(re-frame/reg-event-db
 :election-detail/go-back
 (fn [db [_]]
   (assoc-in db [:active-panel] :election/main)))

(defn get-elections-params
  ; need to flesh this bit out
  [db]
  {})

(re-frame/reg-event-fx
 :election-detail/get-election
 (fn [{:keys [db]} _]
   (let [data (get-elections-params db)]
     {:db db
      :http-xhrio {:method          :get
                   :uri             "http://localhost:4000/earlyvote/elections" ; need to know what the endpoint will be
                   :params          data
                   :timeout         8000
                   :format          (ajax/json-request-format)
                   :response-format (ajax/json-response-format)
                   :on-success [:election-detail/get-election-success]
                   :on-failure [:election-detail/get-election-fail]}})))

(defn election-detail-json->clj
  [json]
  ; need to know what json response will look like
  {:id (get json "id")
   :state-fips (get json "state_fips")
   :election-date (get json "election_date")})

(re-frame/reg-event-db
 :election-detail/get-election-success
 (fn [db [_ result]]
   (assoc-in db [:selected-election :detail]
             (map election-detail-json->clj result))))

(re-frame/reg-event-db
 :election-detail/get-election-fail
 (fn [db [_ result]]
   (re-frame/dispatch [:flash/error "Could not contact server for elections"])
   db))
