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

(def election-list
  [:table {:name "election-list"}
   [:thead
    [:tr
     [:th {:name "election-state"} "State"]
     [:th {:name "election-date"} "Date"]]]
   [:tbody
     [:tr
      [:td {:name "election-state"} "Pennsylvania"]
      [:td {:name "election-date"} "Nov 7, 2017"]]
     [:tr
      [:td {:name "election-state"} "New York"]
      [:td {:name "election-date"} "Nov 7, 2017"]]
     [:tr
      [:td {:name "election-state"} "Colorado"]
      [:td {:name "election-date"} "Nov 7, 2017"]]]])


  ; (let [election-list-items (re-frame/subscribe [:election-list-data])])

(defn election-list-row
  [election]
  [:tr
   [:td {:name "election-state"} (str (:state_fips election))]
   [:td {:name "election-date"} (:election_date election)]])

(defn election-table []
  (let [election-list-items (re-frame/subscribe [:election-list-data])]
    [:p (js->clj @election-list-items)]))
    ; [:table {:name "election-list"}
    ;  [:thead
    ;   [:tr
    ;    [:th {:name "election-state"} "State"]
    ;    [:th {:name "election-date"} "Date"]]]
    ;  [:tbody
    ;   (map election-list-row (js->clj election-list-items))]]))

(defn main-panel []
  (fn []
    [:div
     [election-table]
     [form]]))
