(ns early-vote-site.election-detail.views
  (:require [cljs-pikaday.reagent :as pikaday]
            [cljs-time.format :as format]
            [early-vote-site.constants :as constants]
            [re-frame.core :as re-frame]
            [reagent.ratom :as ratom]))

; these two functions (format-date and format-fips) are copied from election/views
; and can maybe be put in some kind of utils namespace?
(defn format-date
  "Translates from a long date string format (ie 2017-10-10T13:23:34.00Z)
   to a short format (2017-10-10)."
  [date-str]
  (let [full-format (format/formatters :date-time)
        short-format (format/formatters :date)
        parsed (format/parse full-format date-str)]
    (format/unparse short-format parsed)))

(defn format-fips
  "Translates a fips code to state name."
  [fips]
  (get constants/states-by-fips fips))

(defn election-details
  []
  (let [election @(re-frame/subscribe [:election-detail/get])]
    (when election
      [:div
       [:h1 (-> election :state-fips format-fips)]
       [:h2 (-> election :election-date format-date)]])))

(def early-vote-sites
  [:table {:name "early-vote-sites-list"}
   [:thead
    [:tr {:key "early-vote-sites-head-row"}
     [:th {:name "early-vote-site-fips"} "FIPS"]
     [:th {:name "early-vote-site-type"} "Type"]
     [:th {:name "early-vote-site-location-name"} "Location Name"]
     [:th {:name "early-vote-site-address-1"} "Address 1"]
     [:th {:name "early-vote-site-city"} "City"]
     [:th {:name "early-vote-site-action"} "Action"]]]])

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
  (let [election-id @(re-frame/subscribe [:selected-election])]
    (fn []
      [:div
       [:button.button {:on-click #(re-frame/dispatch [:election-detail/go-back])} "go back to all elections"]
       [election-details]
       early-vote-sites
       schedules
       [:p election-id]])))
