(ns early-vote-site.subs
  (:require-macros [reagent.ratom :refer [reaction]])
  (:require [reagent.ratom :refer [make-reaction]])
  (:require [re-frame.core :as re-frame]))

(re-frame/reg-sub
 :state
 (fn [db]
   (:state db)))

(re-frame/reg-sub
 :date
 (fn [_ db]
   (atom @(:date db))))
