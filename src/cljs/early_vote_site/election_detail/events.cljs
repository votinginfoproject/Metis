(ns early-vote-site.election-detail.events
  (:require [ajax.core :as ajax]
            [re-frame.core :as re-frame]
            [clojure.string :as str]))

(re-frame/reg-event-db
 :election-detail/go-back
 (fn [db [_]]
   (assoc-in db [:active-panel] :election/main)))
