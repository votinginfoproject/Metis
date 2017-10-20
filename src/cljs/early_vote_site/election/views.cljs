(ns early-vote-site.election.views
  (:require [cljs-pikaday.reagent :as pikaday]
            [early-vote-site.constants :as constants]
            [early-vote-site.utils :as utils]
            [re-frame.core :as re-frame]
            [reagent.ratom :as ratom]))

(defn state-select-row
  [state]
  [:option {:value (:fips-code state) :key (:fips-code state)} (:state-name state)])

(defn form []
  (let [state (re-frame/subscribe [:election-form/state])
        date (re-frame/subscribe [:election-form/date])]
    [:div
     [:div {:name "create-election-form" :class "form-inline"}
      [:div {:class "form-group mx-sm-3"}
       [:label {:for "state" :style {:padding-right 10}} "State"]
       [:select {:id "state" :type "text" :class "form-control"
                 :value @state
                 :on-change #(re-frame/dispatch [:election-form/state-selected
                                                 (-> % .-target .-value)])}
        (map #(state-select-row %)
             (concat [{:fips-code "" :state-name "Select a State"}]
                     constants/states))]]
      [:div {:class "form-group mx-sm-3"}
       [:label {:for "date" :style {:padding-right 10}} "Date"]
       [pikaday/date-selector {:class "form-control"
                               :date-atom date
                               :pikaday-attrs
                               {:min-date (js/Date.)
                                :on-select #(re-frame/dispatch
                                              [:election-form/date-selected %])}}]]
      [:button.button {:on-click #(re-frame/dispatch [:election-form/save])
                       :disabled @(re-frame/subscribe [:create-disabled?])}
       "add"]]
     [:p @state]
     [:p (some-> @date (js/Date.) .toString)]]))

(defn election-list-row
  [election]
  [:tr {:key (:id election)}
   [:td {:name "election-state"} (-> election :state-fips utils/format-fips)]
   [:td {:name "election-date" :on-click #(re-frame/dispatch [:election-form/election-selected (:id election)])}
    [:div {:class "btn-link"} (-> election :election-date utils/format-date)]]
   [:td
    [:button.button "edit"]]])

(defn election-table []
  (let [election-list-items @(re-frame/subscribe [:elections/list])]
    [:table {:name "election-list"}
     [:thead
      [:tr {:key "elections-head-row"}
       [:th {:name "election-state"} "State"]
       [:th {:name "election-date"} "Date"]]]
     (if (seq election-list-items)
       [:tbody
        (map election-list-row election-list-items)]
       [:tbody
        [:tr [:td {:col-span 2} "No Elections"]]])]))

(defn main-panel []
  (re-frame/dispatch [:elections/list-get])
  (fn []
    [:div
     [election-table]
     [form]]))
