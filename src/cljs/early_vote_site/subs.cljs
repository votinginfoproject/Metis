(ns early-vote-site.subs
  (:require [re-frame.core :as re-frame]))

(re-frame/reg-sub
 :state
 (fn [db]
   (:state db)))

(re-frame/reg-sub
 :date
 (fn [db]
   (some-> db :date .getTime)))
