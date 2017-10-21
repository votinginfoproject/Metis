(ns early-vote-site.election-detail.views
  (:require [cljs-pikaday.reagent :as pikaday]
            [early-vote-site.utils :as utils]
            [early-vote-site.early-vote-site-list.views :as evs.list]
            [re-frame.core :as re-frame]
            [reagent.ratom :as ratom]))

(defn election-details []
  (let [election @(re-frame/subscribe [:election-detail/get])]
    (when election
      [:div
       [:h1 (-> election :state-fips utils/format-fips)]
       [:h2 (-> election :election-date utils/format-date)]])))

(def schedules
  [:table {:name "schedules-list"}
   [:thead
    [:tr {:key "schedules-list-head-row"}
     [:th {:name "schedules-start-date"} "Start Date"]
     [:th {:name "schedules-end-date"} "End Date"]
     [:th {:name "schedules-start-time"} "Start Time"]
     [:th {:name "schedules-end-time"} "End Time"]]]])

(defn main-panel []
  (re-frame/dispatch [:election-detail/get-election])
  (let [site-list (re-frame/subscribe [:early-vote-site-list])]
    (fn []
      [:div
       [:button.button {:on-click #(re-frame/dispatch [:election-detail/go-back])} "go back to all elections"]
       [election-details]
       [evs.list/early-vote-sites-list site-list]
       schedules])))
