(ns early-vote-site.views
  (:require [re-frame.core :as re-frame]
            [cljs-pikaday.reagent :as pikaday]
            [reagent.core :as reagent]))

(defonce the-date (reagent/atom (js/Date.)))

(def form
  [:form {:name "create-election-form"}
   [:label {:for "state"} "State"]
   [:select {:id "state" :type "text"}
    [:option {:value "pa"} "Pennsylvania"]
    [:option {:value "co"} "Colorado"]
    [:option {:value "ny"} "New York"]]
   [:label {:for "date"} "Date"]
   [pikaday/date-selector {:date-atom the-date}]
   [:div {:class "button"} "Submit"]])

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
