(ns early-vote-site.views
  (:require [re-frame.core :as re-frame]
            [cljs-pikaday.reagent :as pikaday]
            [reagent.core :as reagent]
            [early-vote-site.constants :as constants]))

(defn state-select-row
  [state]
  [:option {:value (:fips-code state) :key (:fips-code state)} (:state-name state)])

(defn form []
  (let [state (re-frame/subscribe [:state])
        date (re-frame/subscribe [:date])]
    [:div
     [:form {:name "create-election-form" :class "form-inline"}
      [:div {:class "form-group mx-sm-3"}
       [:label {:for "state" :style {:padding-right 10}} "State"]
       [:select {:id "state" :type "text" :class "form-control"
                 :value @state
                 :on-change #(re-frame/dispatch [:state-selected (-> % .-target .-value)])}
        (map #(state-select-row %) constants/states)]]
      [:div {:class "form-group mx-sm-3"}
       [:label {:for "date" :style {:padding-right 10}} "Date"]
       [pikaday/date-selector {:class "form-control"
                               :date-atom date
                               :on-change #(re-frame/dispatch [:date-selected (-> % .-target .-value)])}]]
      [:button.button "add"]]
     [:p @state]
     [:p @date]]))

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

(defn election-list-row
  ; this will need to take in data from the database to construct the list of elections
  ; what's the best entry point for this?  do we put something in db.cljs that
  ; can pull things from the Postgres database?
  [election]
  [:tr
   [:td {:name "election-state"} (str (:state election))]
   [:td {:name "election-date"} (:date election)]])

(defn main-panel []
  (fn []
    [:div
     election-list
     [form]]))
