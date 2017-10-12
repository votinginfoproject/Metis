(ns early-vote-site.election.events
  (:require [ajax.core :as ajax]
            [clojure.string :as str]
            [early-vote-site.server :as server]
            [re-frame.core :as re-frame]))

(re-frame/reg-event-db
 :election-form/state-selected
 (fn [db [_ new-state-selected]]
   (assoc-in db [:elections :form :state] new-state-selected)))

(re-frame/reg-event-db
 :election-form/date-selected
 (fn [db [_ new-date-selected]]
   (assoc-in db [:elections :form  :date] new-date-selected)))

(defn create-params [db]
  {:state_fips (get-in db [:elections :form :state])
   :election_date (get-in db [:elections :form :date])})

(re-frame/reg-event-fx
 :election-form/save
 (fn [{:keys [db]} _]
   (let [data (create-params db)]
     {:db (assoc db :xhr-spinner true)
      :http-xhrio {:method          :post
                   :uri             (server/url "/earlyvote/elections")
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
   (-> db
       (assoc-in [:elections :form] {:state "" :date nil})
       (dissoc db :xhr-spinner))))

(re-frame/reg-event-db
 :election-xhr/failed
 (fn [db [_ result]]
   (re-frame/dispatch [:flash/error (str "Error saving election"
                                         (pr-str result))])
   (dissoc db :xhr-spinner)))
