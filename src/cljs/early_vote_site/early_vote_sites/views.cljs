(ns early-vote-site.early-vote-sites.views
  (:require [early-vote-site.constants :as constants]
            [re-frame.core :as re-frame]))

(defn form []
  (let [form @(re-frame/subscribe [:early-vote-site-form])]
    [:div
     [:div {:name "create-early-vote-site-form" :class "form-inline"}
      [:div {:class "form-group mx-sm-3"}
       [:label {:for "county-fips" :style {:padding-right 10}} "County FIPS"]
       [:input {:id "county-fips" :type "text" :class "form-control"
                :value (:county-fips form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :county-fips
                                                (-> % .-target .-value)])}]]

      [:div {:class "form-group mx-sm-3"}
       [:label {:for "type" :style {:padding-right 10}} "Type"]
       [:select {:id "type" :type "text" :class "form-control"
                 :value (if-let [type (:type form)] type "")
                 :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                 :type
                                                 (-> % .-target .-value)])}
        [:option {:value "" :key "empty"} "Select Type"]
        [:option {:value "polling_location" :key "polling_location"}
         "Polling Location"]
        [:option {:value "early_vote_site" :key "early_vote_site"}
         "Early Vote Site"]
        [:option {:value "drop_box" :key "drop_box"}
         "Drop Box"]]]

      [:div {:class "form-group mx-sm-3"}
       [:label {:for "name" :style {:padding-right 10}} "Name"]
       [:input {:id "name" :type "text" :class "form-control"
                :value (:name form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :name
                                                (-> % .-target .-value)])}]]

      [:div {:class "form-group mx-sm-3"}
       [:label {:for "address-1" :style {:padding-right 10}} "Address Line 1"]
       [:input {:id "address-1" :type "text" :class "form-control"
                :value (:address-1 form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :address-1
                                                (-> % .-target .-value)])}]]

      [:div {:class "form-group mx-sm-3"}
       [:label {:for "city" :style {:padding-right 10}} "City"]
       [:input {:id "city" :type "text" :class "form-control"
                :value (:city form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :city
                                                (-> % .-target .-value)])}]]

      [:button.button
       {:on-click #(re-frame/dispatch [:early-vote-site-form/save])}
       "Save Early Vote Site"]]]))

(defn site->row [site]
  [:tr {:key (:id site)}
   [:td (:county-fips site)]
   [:td (:type site)]
   [:td (:name site)]
   [:td (:address-1 site)]
   [:td (:city site)]
   [:td "Buttons here"]])

(defn early-vote-sites-table [site-list]
  [:div
   [:table {:name "early-vote-sites-list"}
    [:thead
     [:tr {:key "early-vote-sites-head-row"}
      [:th {:name "early-vote-site-fips"} "FIPS"]
      [:th {:name "early-vote-site-type"} "Type"]
      [:th {:name "early-vote-site-location-name"} "Location Name"]
      [:th {:name "early-vote-site-address-1"} "Address Line 1"]
      [:th {:name "early-vote-site-city"} "City"]
      [:th {:name "early-vote-site-action"} "Action"]]]
    (if (seq @site-list)
      [:tbody
       (map site->row @site-list)]
      [:tbody
       [:tr [:td {:colSpan 5} "No Early Vote Sites"]]])]])
