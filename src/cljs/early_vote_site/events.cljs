(ns early-vote-site.events
  (:require [re-frame.core :as re-frame]
            [early-vote-site.db :as db]))

(re-frame/reg-event-db
 :initialize-db
 (fn  [_ _]
   db/default-db))
