(ns early-vote-site.elections.views
  (:require [cljs-pikaday.reagent :as pikaday]
            [clojure.set :as set]
            [early-vote-site.constants :as constants]
            [early-vote-site.utils :as utils]
            [re-frame.core :as re-frame]
            [reagent.ratom :as ratom]))

(defn state-select-row
  [id state]
  [:option {:value (:fips-code state)
            :key (str id "-" (:fips-code state))}
   (:state-name state)])

(defn form [id]
  (let [all-forms @(re-frame/subscribe [:elections/forms])
        all-errors @(re-frame/subscribe [:elections/errors])
        form-errors (get all-errors id {})
        state (get-in all-forms [id :state])
        date (get-in all-forms [id :date])
        editing? (not= :new id)]
    [:tr {:key (str "editing-" id)}
     [:td
      [:select {:id "state"
                :type "text"
                :class (str "form-control"
                            (when (contains? form-errors :state)
                              " error-highlight"))
                :value state
                :on-change #(re-frame/dispatch [:election-form/update
                                                id :state
                                                (-> % .-target .-value)])}
       (map #(state-select-row id %)
            (concat [{:fips-code "" :state-name "Select a State"}]
                    constants/states))]]
     [:td
      [pikaday/date-selector
       {:date-atom (ratom/atom date)
        :input-attrs
        {:class (str "form-control"
                     (when (contains? form-errors :date)
                       " error-highlight"))}
        :pikaday-attrs
        {:min-date (js/Date.)
         :on-select #(re-frame/dispatch
                      [:election-form/update id :date %])}}]]
     [:td
      [:ul {:class "link-group"}
       [:li
        {:class "btn-link"
         :on-click #(re-frame/dispatch [:election-form/save id])}
        (if editing? "Save" "Add New Election")]
       (when editing?
         [:li
          {:class "btn-link"
           :on-click #(re-frame/dispatch [:elections/end-edit id])}
          "Cancel"])]]]))

(defn election-list-row
  [election]
  (let [roles @(re-frame/subscribe [:roles])
        admin? (seq (set/intersection roles #{"super-admin" "state-admin"}))
        editing @(re-frame/subscribe [:elections/editing])]
    (if (contains? editing (:id election))
      [form (:id election)]
      [:tr {:key (str "viewing-" (:id election))}
       [:td {:name "election-state"} (-> election :state-fips utils/format-fips)]
       [:td {:name "election-date"} (-> election :election-date utils/format-date-string)]
       [:td
        [:ul {:class "link-group"}
         [:li {:class "btn-link"
               :on-click #(re-frame/dispatch [:election-list/election-selected (:id election)])}
          "Manage Early Vote Sites"]
         (when admin?
           [:li {:class "btn-link"
                 :on-click #(re-frame/dispatch [:elections/start-edit election])}
            "Edit"])
         (when admin?
           [:li {:class "btn-link"
                 :on-click #(re-frame/dispatch [:elections/initiate-delete election])}
            "Delete"])
         (when admin?
           [:li {:class "btn-link"
                 :on-click #(re-frame/dispatch [:file/generate (:id election)])}
            "Generate Files"])]]])))

(defn elections-list []
  (let [election-list-items @(re-frame/subscribe [:elections/list])
        roles @(re-frame/subscribe [:roles])]
    [:table {:name "election-list"}
     [:thead
      [:tr {:key "elections-head-row"}
       [:th {:name "election-state"} "State"]
       [:th {:name "election-date"} "Date"]
       [:th {:name "action"} "Actions"]]]
     [:tbody
      (if (seq election-list-items)
        (doall (map election-list-row election-list-items))
        [:tr [:td {:col-span 3} "No Elections"]])
      (when (contains? roles "super-admin")
        [form :new])]]))

(defn breadcrumb []
  [:nav {:aria-label "breadcrumb"
         :role "navigation"}
   [:ol {:class "breadcrumb"}
    [:li {:class "breadcrumb-item active"}
      "Elections"]]])

(defn main-panel []
  [:div
   [breadcrumb]
   [elections-list]])
