(ns early-vote-site.early-vote-site-detail.views
  (:require [re-frame.core :as re-frame]))

(def schedules-header
  [:thead
    [:tr {:key "schedules-list-head-row"}
      [:th {:name "schedules-start-date"} "Start Date"]
      [:th {:name "schedules-end-date"} "End Date"]
      [:th {:name "schedules-start-time"} "Start Time"]
      [:th {:name "schedules-end-time"} "End Time"]]])

(defn schedule->row
  [schedule]
  [:tr {:key (:id schedule)}
   [:td (:start-date schedule)]
   [:td (:end-date schedule)]
   [:td (:start-time schedule)]
   [:td (:end-time schedule)]])

(defn schedules-list []
  (let [schedules @(re-frame/subscribe [:selected-early-vote-site-schedules])]
    [:table {:name "schedules-list"}
      schedules-header
      [:tbody
        (if (seq schedules)
          (map schedule->row schedules)
          [:tr [:td {:colSpan 4} "No Schedules"]])]]))

(defn main-panel []
  (let [early-vote-site @(re-frame/subscribe [:selected-early-vote-site])]
    [:div
      (if (seq early-vote-site)
        [:div "Name" (:name early-vote-site)])
        [schedules-list]]))
