(ns early-vote-site.early-vote-site-detail.views
  (:require [re-frame.core :as re-frame]
            [cljs-pikaday.reagent :as pikaday]
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
                 :value (:id schedule)
                 :on-change #(if (not (nil? (:assignment-id schedule)))
                              (re-frame/dispatch [:unassign-schedule (:assignment-id schedule)])
                              (re-frame/dispatch [:assign-schedule (:id schedule)]))}]]])

(defn schedule-form []
  (let [start-date (re-frame/subscribe [:schedule-form/start-date])]
    [:tr {:key "schedule-form"}
     [:td [pikaday/date-selector {:class "form-control"
                                  :date-atom start-date
                                  :pikaday-attrs
                                  {:min-date (js/Date.)
                                   :on-select #(re-frame/dispatch [:schedule-form/start-date-selected %])}}]]
     [:td [pikaday/date-selector {:class "form-control"
                                  :date-atom start-date
                                  :pikaday-attrs
                                  {:min-date (js/Date.)
                                   :on-select #(re-frame/dispatch [:schedule-form/end-date-selected %])}}]]
     [:td]
     [:td]
     [:td [:button.button {:on-click #(re-frame/dispatch [:schedule-form/save])} "save new schedule"]]]))

(defn schedules-list [selected-early-vote-site-id]
  (let [schedules @(re-frame/subscribe [:selected-early-vote-site-schedules])]
    [:table {:name "schedules-list"}
      schedules-header
      [:tbody
       (if (seq schedules)
         (map schedule->row schedules)
         [:tr [:td {:colSpan 5} "No Schedules"]])
       [schedule-form]]]))

(defn main-panel []
  (let [early-vote-site @(re-frame/subscribe [:selected-early-vote-site])]
    [:div
     [:button.button {:on-click #(re-frame/dispatch [:navigate/election-detail])} "go back to election"]
     (when early-vote-site
       [:div "Name" (:name early-vote-site)])
     [schedules-list]]))
