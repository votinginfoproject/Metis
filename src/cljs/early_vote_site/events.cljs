(ns early-vote-site.events
  (:require [re-frame.core :as re-frame]
            [early-vote-site.db :as db]
            [early-vote-site.election.events :as elections]
            [early-vote-site.election-detail.events :as ed]
            [early-vote-site.early-vote-site-form.events :as early-vote-form]
            [early-vote-site.early-vote-site-list.events :as early-vote-list]
            [early-vote-site.early-vote-site-detail.events :as early-vote-site-detail]
            [early-vote-site.flash.events]))

(re-frame/reg-event-db
 :initialize-db
 (fn  [_ _]
   db/default-db))

(re-frame/reg-event-db
 :early-vote-site-form/update
 early-vote-form/form-update)

(re-frame/reg-event-fx
 :early-vote-site-form/save
 early-vote-form/form-submit)

(re-frame/reg-event-fx
 :early-vote-site-save/success
 early-vote-form/save-success)

(re-frame/reg-event-fx
 :early-vote-site-save/failure
 early-vote-form/save-failure)

(re-frame/reg-event-fx
 :early-vote-site-list/get
 early-vote-list/list-early-vote-sites)

(re-frame/reg-event-db
 :early-vote-site-list/success
 early-vote-list/list-success)

(re-frame/reg-event-fx
 :early-vote-site-list/failure
 early-vote-list/list-failure)

(re-frame/reg-event-fx
 :navigate/election-detail
 ed/navigate)

(re-frame/reg-event-fx
 :navigate/early-vote-form
 early-vote-form/navigate)

(re-frame/reg-event-fx
 :navigate/elections
 elections/navigate)

(re-frame/reg-event-fx
 :navigate/early-vote-site-detail
 early-vote-site-detail/navigate)

(re-frame/reg-event-db
 :schedules-list/success
 early-vote-site-detail/load-schedules-success)

(re-frame/reg-event-fx
 :schedules-list/failure
 early-vote-site-detail/load-schedules-failure)

(re-frame/reg-event-fx
 :schedules-list/get
 early-vote-site-detail/list-schedules)
