(ns early-vote-site.early-vote-site-detail.subs)

(def subscriptions
  {:schedules [:schedules]
   :selected-early-vote-site-id [:selected-early-vote-site-id]
   :selected-early-vote-site [:selected-early-vote-site]
   :selected-early-vote-site-schedules [:selected-early-vote-site-schedules]
   :schedule-form/start-date [:schedules :form  :start-date]
   :schedule-form/end-date [:schedules :form  :end-date]
   :schedule-form/start-time [:schedules :form  :start-time]
   :schedule-form/end-time [:schedules :form  :end-time]
   :schedule-form/timezone [:schedules :form  :timezone]})
