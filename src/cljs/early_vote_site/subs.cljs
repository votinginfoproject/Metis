(ns early-vote-site.subs
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.subs]
            [early-vote-site.election-detail.subs]
            [early-vote-site.flash.subs]
            [early-vote-site.early-vote-site-form.subs :as evs.form]
            [early-vote-site.early-vote-site-list.subs :as evs.list]))

(re-frame/reg-sub
 :active-panel
 (fn [db]
   (:active-panel db)))

(re-frame/reg-sub
 :early-vote-site-form
 evs.form/form)

(re-frame/reg-sub
 :early-vote-site-list
 evs.list/early-vote-site-list)
