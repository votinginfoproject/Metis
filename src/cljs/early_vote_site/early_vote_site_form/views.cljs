(ns early-vote-site.early-vote-site-form.views
  (:require [early-vote-site.constants :as constants]
            [re-frame.core :as re-frame]))

(defn main-panel []
  (let [form @(re-frame/subscribe [:early-vote-site-form])]
    [:div
     [:div {:name "create-early-vote-site-form"}
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
       [:label {:for "address-2" :style {:padding-right 10}} "Address Line 2"]
       [:input {:id "address-2" :type "text" :class "form-control"
                :value (:address-2 form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :address-2
                                                (-> % .-target .-value)])}]]

      [:div {:class "form-group mx-sm-3"}
       [:label {:for "address-3" :style {:padding-right 10}} "Address Line 3"]
       [:input {:id "address-3" :type "text" :class "form-control"
                :value (:address-3 form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :address-3
                                                (-> % .-target .-value)])}]]

      [:div {:class "form-group mx-sm-3"}
       [:label {:for "city" :style {:padding-right 10}} "City"]
       [:input {:id "city" :type "text" :class "form-control"
                :value (:city form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :city
                                                (-> % .-target .-value)])}]]

      [:div {:class "form-group mx-sm-3"}
       [:label {:for "zip" :style {:padding-right 10}} "Zip"]
       [:input {:id "zip" :type "text" :class "form-control"
                :value (:zip form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :zip
                                                (-> % .-target .-value)])}]]

      [:div {:class "form-group mx-sm-3"}
       [:label {:for "directions" :style {:padding-right 10}} "Directions"]
       [:input {:id "directions" :type "text" :class "form-control"
                :value (:directions form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :directions
                                                (-> % .-target .-value)])}]]

      [:div {:class "form-group mx-sm-3"}
       [:label {:for "voter-services" :style {:padding-right 10}} "Voter Services"]
       [:input {:id "voter-services" :type "text" :class "form-control"
                :value (:voter-services form)
                :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                :voter-services
                                                (-> % .-target .-value)])}]]

      [:button.button
       {:on-click #(re-frame/dispatch [:early-vote-site-form/save])}
       "Save Early Vote Site"]]]))
