(ns early-vote-site.flash.subs
  (:require [re-frame.core :as re-frame]))

(re-frame/reg-sub
 :flash/message
 (fn [db]
   (get-in db [:flash :message] nil)))

(re-frame/reg-sub
 :flash/error
 (fn [db]
   (get-in db [:flash :error] nil)))
