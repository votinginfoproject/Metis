(ns early-vote-site.election.subs
  (:require [ajax.core :as ajax]
            [ajax.core :refer [GET]]
            [re-frame.core :as re-frame]))

(re-frame/reg-sub
 :election-form/state
 (fn [db]
   (get-in db [:elections :form :state])))

(re-frame/reg-sub
 :election-form/date
 (fn [db]
   (some-> db
           (get-in [:elections :form :date])
           .getTime)))

(re-frame/reg-sub
 :create-disabled?
 (fn [db]
   (or (= nil (get-in db [:elections :form :date]))
       (= "" (get-in db [:elections :form :state])))))

(def elections-query-id (atom 0))

(defn issue-elections-query! []
  (let [query-id (swap! elections-query-id inc)]
    (GET
     "http://localhost:4000/earlyvote/elections"
     {:handler #(re-frame/dispatch
                 [:election-list/get {:query-id query-id
                                      :result %1}])})
    query-id))

(re-frame/reg-sub
 :election-list
 (fn [db]
   (:election-list db)))

(re-frame/reg-sub-raw
 :election-list-data
 (fn [app-db [_ type]]
   (let [query-id (issue-elections-query!)]
     (reagent.ratom/reaction
      (get @(re-frame/subscribe [:election-list]) query-id)))))
