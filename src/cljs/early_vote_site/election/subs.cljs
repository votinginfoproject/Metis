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

(defn issue-elections-query! []
  (GET
   "http://localhost:4000/earlyvote/getelections"
   {:handler #(re-frame/dispatch [:election-list/get %1])}))
  ; (let [fips-code ""]
    ; {:http-xhrio {:method          :get
    ;               :uri             "http://localhost:4000/earlyvote/getelections"
    ;               :timeout         8000
    ;               :format          (ajax/json-request-format)
    ;               :response-format (ajax/json-response-format)
    ;               :on-success #(re-frame/dispatch [:election-list/get])}})
    ;               ; :on-failure [:election-xhr/failed]}})

(re-frame/reg-sub-raw
 :election-list-data
 (fn [app-db [_ type]]
   (let [query-token (issue-elections-query!)]
     (reagent.ratom/make-reaction
      (fn [] (get app-db [:election-list] query-token))))))
      ; :on-dispose #(do (terminate-items-query! query-token)
      ;                  (re-frame/dispatch [:cleanup [:some :path]]))))))
