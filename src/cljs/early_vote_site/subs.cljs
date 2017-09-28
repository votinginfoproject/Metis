(ns early-vote-site.election.subs
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.subs]))

(re-frame/reg-sub
 :active-panel
 (fn [db]
   (:active-panel db)))
