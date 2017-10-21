(ns early-vote-site.events
  (:require [re-frame.core :as re-frame]
            [early-vote-site.db :as db]
            [early-vote-site.election.events]
            [early-vote-site.election-detail.events]
            [early-vote-site.early-vote-site-list.events :as early-vote-list]
            [early-vote-site.flash.events]))

(re-frame/reg-event-db
 :initialize-db
 (fn  [_ _]
   db/default-db))
(re-frame/reg-event-fx
 :early-vote-site-list/get
 early-vote-sites/list-early-vote-sites)

(re-frame/reg-event-db
 :early-vote-site-list/success
 early-vote-sites/list-success)

(re-frame/reg-event-fx
 :early-vote-site-list/failure
 early-vote-sites/list-failure)
