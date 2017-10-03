(ns early-vote-site.views
  (:require [re-frame.core :as re-frame]
            [cljs-pikaday.reagent :as pikaday]
            [reagent.core :as reagent]
            [early-vote-site.constants :as constants]))

(defonce the-date (reagent/atom (js/Date.)))

(defn state-select-row
  [state]
  [:option {:value (:fips-code state) :key (:fips-code state)} (:state-name state)])

(def form
  [:form {:name "create-election-form" :class "form-inline"}
   [:div {:class "form-group mx-sm-3"}
    [:label {:for "state" :style {:padding-right 10}} "State"]
    [:select {:id "state" :type "text" :class "form-control"}
     (map #(state-select-row %) constants/states)]]
   [:div {:class "form-group mx-sm-3"}
    [:label {:for "date" :style {:padding-right 10}} "Date"]
    [pikaday/date-selector {:date-atom the-date :class "form-control"}]]
   [:button {:class "button"} "add"]])

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
  (let [name (re-frame/subscribe [:name])]
    (fn []
      [:div
       election-list
       form])))
