(ns early-vote-site.election-detail.views
  (:require [clojure.string :as str]
            [early-vote-site.utils :as utils]
            [early-vote-site.places :as places]
            [re-frame.core :as re-frame]))

(def type-to-name
  {"polling_location" "Polling Location"
   "early_vote_site" "Early Vote Site"
   "drop_box" "Drop Box"})

(defn site->row [state-fips site]
  [:tr {:key (:id site)}
   [:td (places/fips-name (:county-fips site))]
   [:td (get type-to-name (:type site))]
   [:td (:name site)]
   [:td (:address-1 site)]
   [:td (:city site)]
   [:td
    [:ul {:class "link-group"}
     [:li {:class "btn-link"
           :on-click #(re-frame/dispatch
                       [:navigate/early-vote-site-detail (:id site)])}
      "Manage Schedules"]
     [:li {:class "btn-link"
           :on-click #(re-frame/dispatch
                       [:navigate/edit-early-vote-site-form (:id site)])}
      "Edit"]
     [:li {:class "btn-link"
           :on-click #(re-frame/dispatch
                       [:early-vote-site/duplicate (:id site)])}
      "Duplicate"]
     [:li {:class "btn-link"
           :on-click #(re-frame/dispatch
                       [:early-vote-site/initiate-delete site])}
      "Delete"]]]])

(defn county-filter [site-list]
  (let [selected-county-fips @(re-frame/subscribe [:election-detail/selected-county-fips])]
    (if (str/blank? selected-county-fips)
      site-list
      (filter #(= selected-county-fips (:county-fips %)) site-list))))

(defn type-filter [site-list]
  (let [selected-type @(re-frame/subscribe [:election-detail/selected-type])]
    (if (str/blank? selected-type)
      site-list
      (filter #(= selected-type (:type %)) site-list))))

(defn apply-filters [site-list]
 (->> site-list
   (county-filter)
   (type-filter)))

(defn county-select []
  (let [site-list @(re-frame/subscribe [:election-detail/early-vote-site-list])]
    [:select
     {:id "county-fips-select"
      :class "header-select"
      :aria-label "County/FIPS"
      :name "county-fips"
      :on-change #(re-frame/dispatch [:early-vote-site-list/filter :selected-county-fips (-> % (.-target) (.-value))])}
     [:option {:value "" :key "default-option"} "all"]
     (for [fips (distinct (map #(:county-fips %) site-list))]
       [:option {:value fips :key (str fips "-option")} (places/fips-name fips)])]))

(defn type-select []
  (let [site-list @(re-frame/subscribe [:election-detail/early-vote-site-list])]
    [:select
     {:id "type-select"
      :class "header-select"
      :aria-label "Type"
      :name "type"
      :on-change #(re-frame/dispatch [:early-vote-site-list/filter :selected-type (-> % (.-target) (.-value))])}
     [:option {:value "" :key "default-option"} "all"]
     (for [type (distinct (map #(:type %) site-list))]
       [:option {:value type :key (str type "-option")} (type-to-name type)])]))

(defn early-vote-sites-list [election]
  (let [state-fips (:state-fips election)
        site-list @(re-frame/subscribe [:election-detail/early-vote-site-list])]
    [:div
     [:table {:name "early-vote-sites-list"}
      [:thead
       [:tr {:key "early-vote-sites-head-row"}
        [:th {:name "early-vote-site-fips"} "County/FIPS " [county-select]]
        [:th {:name "early-vote-site-type"} "Type " [type-select]]
        [:th {:name "early-vote-site-location-name"} "Location Name"]
        [:th {:name "early-vote-site-address-1"} "Address Line 1"]
        [:th {:name "early-vote-site-city"} "City"]
        [:th {:name "early-vote-site-action"} "Action"]]]
      [:tbody
       (if (seq site-list)
         (map (partial site->row state-fips) (apply-filters site-list))
         [:tr [:td {:colSpan 6} "No Early Vote Sites"]])]]]))

(defn election-details [election]
  (when election
    [:div
     [:h3 (-> election :state-fips places/fips-name)]
     [:h4 {:style {:display "inline"}} (-> election :election-date utils/format-date-string)]
     [:button.button
      {:style {:float "right" :margin-bottom "10px"}
       :on-click #(re-frame/dispatch [:navigate/early-vote-site-form])}
      "Create an Early Vote Site"]]))

(defn breadcrumb [election]
  (when election
    [:nav {:aria-label "breadcrumb"
           :role "navigation"}
     [:ol {:class "breadcrumb"}
      [:li {:class "breadcrumb-item"}
           [:a {:href "#"
                :on-click #(re-frame/dispatch [:navigate/elections])}
            "Elections"]]
      [:li {:class "breadcrumb-item active"}
        (utils/format-date-string (:election-date election))]]]))

(defn main-panel []
  (let [election @(re-frame/subscribe [:election-detail/election])]
    [:div
      [breadcrumb election]
      [:h1 "Manage Early Vote Sites"]
      [:p "To get started, click “Create an Early Vote Site” and enter
           information in the required fields. Once an Early Vote Site has
           been created, click “Manage Schedules” to specify the days and hours
           the site will be open."]
      [election-details election]
      [early-vote-sites-list election]]))
