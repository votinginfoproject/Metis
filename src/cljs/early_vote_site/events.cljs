(ns early-vote-site.events
  (:require [re-frame.core :as re-frame]
            [early-vote-site.db :as db]))

(re-frame/reg-event-db
 :initialize-db
 (fn  [_ _]
   db/default-db))

(re-frame/reg-event-db
 :state-selected
 (fn [db [_ new-state-selected]]
   (assoc db :state new-state-selected)))

(re-frame/reg-event-db
 :date-selected
 (fn [db [_ new-date-selected]]
   (assoc db :date new-date-selected)))
