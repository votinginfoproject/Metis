(ns early-vote-site.election.subs
  (:require [clojure.string :as string]
            [re-frame.core :as re-frame]))

(defn form-date
  [db]
  (some-> db
          (get-in [:elections :form :date])
          .getTime))

(defn create-disabled?
  [db]
  (or (string/blank? (get-in db [:elections :form :date]))
      (string/blank? (get-in db [:elections :form :state]))))

(def subscriptions
  {:election-form/state [:elections :form :state]
   :election-form/date form-date
   :create-disabled? create-disabled?
   :elections/list [:elections :list]})
