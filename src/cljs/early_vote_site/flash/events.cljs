(ns early-vote-site.flash.events
  (:require [re-frame.core :as re-frame]))

(re-frame/reg-event-db
 :flash/message
 (fn [db [_ new-message]]
   (assoc-in db [:flash :message] new-message)))

(re-frame/reg-event-db
 :flash/error
 (fn [db [_ new-error]]
   (assoc-in db [:flash :error] new-error)))

(re-frame/reg-event-db
 :flash/clear
 (fn [db _]
   (assoc db :flash {})))
