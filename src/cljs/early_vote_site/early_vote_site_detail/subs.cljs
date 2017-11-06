(ns early-vote-site.early-vote-site-detail.subs)

(def subscriptions
  {:selected-early-vote-site-id [:selected-early-vote-site-id]
   :selected-early-vote-site [:early-vote-site-detail :early-vote-site]
   :selected-early-vote-site-schedules [:early-vote-site-detail :schedules]
   :schedules/editing [:early-vote-site-detail :editing]
   :schedules/errors [:early-vote-site-detail :errors]})
