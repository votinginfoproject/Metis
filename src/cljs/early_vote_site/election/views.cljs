(ns early-vote-site.election.views
  (:require [re-frame.core :as re-frame]
            [cljs-pikaday.reagent :as pikaday]
            [reagent.ratom :as ratom]
            [early-vote-site.constants :as constants]))

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
  [:tr {:key (get election "id")}
   [:td {:name "election-state"} (str (get election "state_fips"))]
   [:td {:name "election-date"} (get election "election_date")]])

(defn election-table []
  (let [election-list-items @(re-frame/subscribe [:election-list-data])]
    [:table {:name "election-list"}
     [:thead
      [:tr {:key "elections-head-row"}
       [:th {:name "election-state"} "State"]
       [:th {:name "election-date"} "Date"]]]
     (if (seq election-list-items)
       [:tbody
        (map election-list-row (js->clj election-list-items))]
       [:tbody
        [:tr [:td "No Elections"]]])]))

(defn main-panel []
  (fn []
    [:div
     [election-table]
     [form]]))
