(ns early-vote-site.election.subs
  (:require [clojure.string :as string]
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
   (or (string/blank? (get-in db [:elections :form :date]))
       (string/blank? (get-in db [:elections :form :state])))))

(re-frame/reg-sub
 :elections/list
 (fn [db]
   (get-in db [:elections :list])))

