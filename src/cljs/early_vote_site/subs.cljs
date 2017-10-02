(ns early-vote-site.subs
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.subs]
            [early-vote-site.flash.subs]))

(re-frame/reg-sub
 :active-panel
 (fn [db]
   (:active-panel db)))
