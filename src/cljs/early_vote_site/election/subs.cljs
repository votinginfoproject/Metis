(ns early-vote-site.election.subs
  (:require [clojure.string :as string]
            [re-frame.core :as re-frame]))

(defn create-disabled?
  [db]
  false
  #_(or (string/blank? (get-in db [:elections :form :date]))
      (string/blank? (get-in db [:elections :form :state]))))

(def subscriptions
  {:election-forms [:elections :forms]
   :create-disabled? create-disabled?
   :elections/list [:elections :list]
   :elections/editing [:elections :editing]
   :elections/errors [:elections :errors]})
