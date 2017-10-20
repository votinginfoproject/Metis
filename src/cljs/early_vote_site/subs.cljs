(ns early-vote-site.subs
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.subs]
            [early-vote-site.election-detail.subs]
            [early-vote-site.flash.subs]
            [early-vote-site.early-vote-sites.subs :as early-vote-sites]))

(re-frame/reg-sub
 :active-panel
 (fn [db]
   (:active-panel db)))

(re-frame/reg-sub
 :early-vote-site-list
 early-vote-sites/early-vote-site-list)
