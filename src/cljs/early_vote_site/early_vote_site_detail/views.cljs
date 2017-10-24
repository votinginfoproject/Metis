(ns early-vote-site.early-vote-site-detail.views
  (:require [re-frame.core :as re-frame]
            [early-vote-site.utils :as utils]))

(def schedules-header
  [:thead
    [:tr {:key "schedules-list-head-row"}
      [:th {:name "schedules-start-date"} "Start Date"]
      [:th {:name "schedules-end-date"} "End Date"]
      [:th {:name "schedules-start-time"} "Start Time"]
      [:th {:name "schedules-end-time"} "End Time"]
      [:th {:name "assigned"} "Assigned to this Early Vote Site"]]])

(defn schedule->row
  [schedule]
  [:tr {:key (:id schedule)}
   [:td (utils/format-date (:start-date schedule))]
   [:td (utils/format-date (:end-date schedule))]
   [:td (:start-time schedule)]
   [:td (:end-time schedule)]
   [:td [:input {:type "checkbox"
                 :checked (not (nil? (:assignment-id schedule)))
                 :value (:id schedule)}]]])

(defn schedules-list [selected-early-vote-site-id]
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
     [:button.button {:on-click #(re-frame/dispatch [:navigate/election-detail])} "go back to election"]
      (when (seq early-vote-site)
        [:div "Name" (:name early-vote-site)])
      [schedules-list]]))
