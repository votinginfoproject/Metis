(ns early-vote-site.early-vote-site-form.views
  (:require [early-vote-site.places :as places]
            [early-vote-site.utils :as utils]
            [re-frame.core :as re-frame]))

(defn breadcrumb [election form]
  (println form)
  (when election
    [:nav {:aria-label "breadcrumb"
           :role "navigation"}
     [:ol {:class "breadcrumb"}
      [:li {:class "breadcrumb-item"}
           [:a {:href "#"
                :on-click #(re-frame/dispatch [:navigate/elections])}
            "Elections"]]
      [:li {:class "breadcrumb-item"}
           [:a {:href "#"
                :on-click #(re-frame/dispatch [:navigate/election-detail])}
            (utils/format-date-string (:election-date election))]]
      [:li {:class "breadcrumb-item active"}
           (if (:election-id form) "Edit an early vote site" "Create an early vote site")]]]))

(defn main-panel []
  (let [form @(re-frame/subscribe [:early-vote-site-form])
        election @(re-frame/subscribe [:election-detail/election])
        roles @(re-frame/subscribe [:roles])
        fips (first @(re-frame/subscribe [:fips-codes]))
        county-fips (:county-fips form)]
    [:div
     [breadcrumb election form]
     [:h1 (if (:election-id form) "Edit an Early Vote Site" "Create an Early Vote Site")]
     [:p (if (:election-id form) "To edit an early vote site, fill in the form below. Fields marked
          with an asterisk (*) are required. When you are finished, click on
          'Save Early Vote Site'." "To create an early vote site, fill in the form below. Fields marked
               with an asterisk (*) are required. When you are finished, click on
               'Save Early Vote Site'.")]
     [:h3 (-> election :state-fips places/fips-name)]
     [:h4 (-> election :election-date utils/format-date-string)]
     [:div {:name "create-early-vote-site-form"}
      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "county-fips" :class "col-2 col-form-label" :style {:padding-right 10}} "County Name*:"]
       (if (not (contains? roles "data-centralization"))
         [:div {:class "col-10"}
          [:select {:id "county-fips" :type "text" :class "form-control col-md-6"
                    :value (or county-fips "")
                    :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                    :county-fips
                                                    (-> % .-target .-value)])}
           [:option {:value "" :key ""} "Select a County"]
           (map (fn [[cf name]]
                  [:option {:value cf :key cf} name])
                (places/county-list (:state-fips election)))]]
         [:div {:class "col-10"} (places/fips-name county-fips)
          [:input {:type "hidden" :name "county-fips" :value county-fips}]])]

      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "type" :class "col-2 col-form-label" :style {:padding-right 10}} "Type:"]
       [:div {:class "col-10"}
         [:select {:id "type" :type "text" :class "form-control col-md-6"
                   :value (if-let [type (:type form)] type "early_vote_site")
                   :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                   :type
                                                   (-> % .-target .-value)])}
            [:option {:value "early_vote_site" :key "early_vote_site"}
             "Early Vote Site"]
            [:option {:value "polling_location" :key "polling_location"}
             "Polling Location"]
            [:option {:value "drop_box" :key "drop_box"}
             "Drop Box"]]]]

      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "name" :class "col-2 col-form-label" :style {:padding-right 10}} "Name*:"]
       [:div {:class "col-10"}
         [:input {:id "name" :type "text" :class "form-control col-md-6"
                  :value (:name form)
                  :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                  :name
                                                  (-> % .-target .-value)])}]]]

      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "address-1" :class "col-2 col-form-label" :style {:padding-right 10}} "Address Line 1*:"]
       [:div {:class "col-10"}
         [:input {:id "address-1" :type "text" :class "form-control col-md-6"
                  :value (:address-1 form)
                  :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                  :address-1
                                                  (-> % .-target .-value)])}]]]

      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "address-2" :class "col-2 col-form-label" :style {:padding-right 10}} "Address Line 2:"]
       [:div {:class "col-10"}
         [:input {:id "address-2" :type "text" :class "form-control col-md-6"
                  :value (:address-2 form)
                  :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                  :address-2
                                                  (-> % .-target .-value)])}]]]

      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "address-3" :class "col-2 col-form-label" :style {:padding-right 10}} "Address Line 3:"]
       [:div {:class "col-10"}
         [:input {:id "address-3" :type "text" :class "form-control col-md-6"
                  :value (:address-3 form)
                  :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                  :address-3
                                                  (-> % .-target .-value)])}]]]

      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "city" :class "col-2 col-form-label" :style {:padding-right 10}} "City*:"]
       [:div {:class "col-10"}
         [:input {:id "city" :type "text" :class "form-control col-md-6"
                  :value (:city form)
                  :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                  :city
                                                  (-> % .-target .-value)])}]]]

      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "zip" :class "col-2 col-form-label" :style {:padding-right 10}} "Zip:"]
       [:div {:class "col-10"}
         [:input {:id "zip" :type "text" :class "form-control col-md-6"
                  :value (:zip form)
                  :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                  :zip
                                                  (-> % .-target .-value)])}]]]

      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "directions" :class "col-2 col-form-label" :style {:padding-right 10}} "Directions:"]
       [:div {:class "col-10"}
         [:input {:id "directions" :type "text" :class "form-control col-md-6"
                  :value (:directions form)
                  :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                  :directions
                                                  (-> % .-target .-value)])}]]]

      [:div {:class "form-group row mx-sm-3"}
       [:label {:for "voter-services" :class "col-2 col-form-label" :style {:padding-right 10}} "Voter Services:"]
       [:div {:class "col-10"}
         [:input {:id "voter-services" :type "text" :class "form-control col-md-6"
                  :value (:voter-services form)
                  :on-change #(re-frame/dispatch [:early-vote-site-form/update
                                                  :voter-services
                                                  (-> % .-target .-value)])}]]]

      [:p "* required"]
      [:button.button
       {:on-click #(re-frame/dispatch [:early-vote-site-form/save])}
       "Save Early Vote Site"]
      [:button.button
       {:on-click #(re-frame/dispatch [:early-vote-site-form/save true])}
       "Add Schedules"]
      [:button.button
       {:on-click #(re-frame/dispatch [:navigate/election-detail])}
       "Cancel"]]]))
