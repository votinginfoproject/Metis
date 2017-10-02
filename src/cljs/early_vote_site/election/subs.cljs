(ns early-vote-site.election.subs
  (:require [re-frame.core :as re-frame]))

(re-frame/reg-sub
 :election-form/state
 (fn [db]
   (get-in db [:elections :form :state])))

(re-frame/reg-sub
 :election-form/date
 (fn [db]
   (some-> db
           (get-in [:elections :form :date])
           deref
           .getTime)))

(re-frame/reg-sub
 :create-disabled?
 (fn [db]
   (or (= nil (get-in db [:elections :form :date]))
       (= "" (get-in db [:elections :form :state])))))
