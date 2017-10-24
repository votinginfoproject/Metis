(ns early-vote-site.early-vote-site-detail.subs)

(def subscriptions
  {:schedules [:schedules]
   :selected-early-vote-site-id [:selected-early-vote-site-id]
   :selected-early-vote-site [:selected-early-vote-site]
   :selected-early-vote-site-schedules [:selected-early-vote-site-schedules]
   :schedule-form/start-date (fn [_] (js/Date.))})
