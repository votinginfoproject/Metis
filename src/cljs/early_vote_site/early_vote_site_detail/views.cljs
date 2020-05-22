(ns early-vote-site.early-vote-site-detail.views
  (:require [cljs-pikaday.reagent :as pikaday]
            [early-vote-site.utils :as utils]
            [clojure.string :as str]
            [re-frame.core :as re-frame]
            [reagent.ratom :as r]))

(defn early-vote-site-detail
  [early-vote-site]
  (when early-vote-site
    [:h2 (:name early-vote-site)]))

(defn new-form []
  {:start-date-atom (r/atom (js/Date.))
   :end-date-atom (r/atom nil)
   :start-time-atom (r/atom nil)
   :end-time-atom (r/atom nil)
   :timezone-atom (r/atom nil)})

(defn edit-form [schedule]
  {:id (:id schedule)
   :start-date-atom (r/atom (utils/parse-date (:start-date schedule)))
   :end-date-atom (r/atom (utils/parse-date (:end-date schedule)))
   :start-time-atom (r/atom (:start-time schedule))
   :end-time-atom (r/atom (:end-time schedule))
   :timezone-atom (r/atom (:timezone schedule))})

(defn schedule-form [schedule]
  (let [editing? (seq schedule)
        form (if editing?
               (edit-form schedule)
               (new-form))]
    (fn []
      (let [all-errors @(re-frame/subscribe [:schedules/errors])
            form-errors (if editing?
                          (get all-errors (:id schedule) {})
                          (get all-errors :new {}))]
        [:tr
         [:td [pikaday/date-selector
               {:input-attrs
                {:class (str "form-control"
                             (when (contains? form-errors :start-date)
                               " error-highlight"))}
                :date-atom (:start-date-atom form)
                :max-date-atom (:end-date-atom form)
                :pikaday-attrs
                {:min-date (if editing? () (js/Date.))
                 :max-date @(:end-date-atom form)}}]]
         [:td [pikaday/date-selector
               {:input-attrs
                {:class (str "form-control"
                             (when (contains? form-errors :end-date)
                               " error-highlight"))}
                :date-atom (:end-date-atom form)
                :min-date-atom (:start-date-atom form)
                :pikaday-attrs
                {:min-date (or @(:start-date-atom form)
                               (js/Date.))}}]]
         [:td [:input {:type "time"
                       :class (str "form-control"
                                   (when (contains? form-errors :start-time)
                                     " error-highlight"))
                       :value @(:start-time-atom form)
                       :on-change #(reset! (:start-time-atom form)
                                           (-> % .-target .-value))}]]
         [:td [:input {:type "time"
                       :class (str "form-control"
                                   (when (contains? form-errors :end-time)
                                     " error-highlight"))
                       :value @(:end-time-atom form)
                       :on-change #(reset! (:end-time-atom form)
                                           (-> % .-target .-value))}]]
         [:td [:select {:type "text"
                        :class (str "form-control"
                                    (when (contains? form-errors :timezone)
                                      " error-highlight"))
                        :value (or @(:timezone-atom form) "")
                        :on-change #(reset! (:timezone-atom form)
                                            (-> % .-target .-value))}
               [:option {:value ""} "Select"]
               [:option {:value "EST"} "EST"]
               [:option {:value "EDT"} "EDT"]
               [:option {:value "CST"} "CST"]
               [:option {:value "CDT"} "CDT"]
               [:option {:value "MST"} "MST"]
               [:option {:value "MDT"} "MDT"]
               [:option {:value "PST"} "PST"]
               [:option {:value "PDT"} "PDT"]
               [:option {:value "AKST"} "AKST"]
               [:option {:value "AKDT"} "AKDT"]
               [:option {:value "HST"} "HST"]
               [:option {:value "HDT"} "HDT"]]]
         [:td]
         [:td
          [:ul {:class "link-group"}
           [:li {:class "btn-link"
                 :on-click #(re-frame/dispatch [:schedule-form/save form])}
            "Save"]
           (when editing?
             [:li {:class "btn-link"
                   :on-click #(re-frame/dispatch
                               [:schedule/end-edit (:id form)])}
              "Cancel"])]]]))))

(defn schedule->row
  [editing schedule]
  (if (contains? editing (:id schedule))
    (list
      [schedule-form schedule]
      [:tr
       [:td {:colSpan "7" :style {:border "none" :padding-top "0"}}
        [:div {:class "alert-box" :style {:margin "0"}} "This schedule may be associated with multiple Early Vote Sites. Edits made here will apply across all sites."]]])
    [:tr {:key (str "schedule-" (:id schedule))}
     [:td (utils/format-date-string (:start-date schedule))]
     [:td (utils/format-date-string (:end-date schedule))]
     [:td (utils/military-to-standard (:start-time schedule))]
     [:td (utils/military-to-standard (:end-time schedule))]
     [:td (:timezone schedule)]
     [:td [:input {:type "checkbox"
                   :checked (not (nil? (:assignment-id schedule)))
                   :value (:id schedule)
                   :on-change
                   #(if (not (nil? (:assignment-id schedule)))
                      (re-frame/dispatch [:unassign-schedule
                                          (:assignment-id schedule)])
                      (re-frame/dispatch [:assign-schedule (:id schedule)]))}]]
     [:td
      [:ul {:class "link-group"}
        [:li
         {:class "btn-link"
          :on-click #(re-frame/dispatch [:schedule/start-edit (:id schedule)])}
         "Edit"]
        [:li
         {:class "btn-link"
          :on-click #(re-frame/dispatch [:schedule/initiate-delete schedule])}
         "Delete"]]]]))

(defn schedules-list [selected-early-vote-site-id]
  (let [schedules @(re-frame/subscribe [:selected-early-vote-site-schedules])
        editing @(re-frame/subscribe [:schedules/editing])]
    [:table {:name "schedules-list"}
     [:thead
      [:tr {:key "schedules-list-head-row"}
       [:th {:name "schedules-start-date"} "Start Date"]
       [:th {:name "schedules-end-date"} "End Date"]
       [:th {:name "schedules-start-time"} "Start Time"]
       [:th {:name "schedules-end-time"} "End Time"]
       [:th {:name "schedules-timezone"} "Time Zone"]
       [:th {:name "assigned"} "Assigned"]
       [:th {:name "actions"} "Actions"]]]
     [:tbody
      (if (seq schedules)
        (map (partial schedule->row editing) schedules)
        [:tr [:td {:colSpan 7} "No Schedules"]])
      [schedule-form nil]]]))

(defn breadcrumb [election early-vote-site]
  (when early-vote-site
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
       [:li {:class "breadcrumb-item active"} [:span (:name early-vote-site)]]]]))


(defn main-panel []
  (let [early-vote-site @(re-frame/subscribe [:selected-early-vote-site])
        election @(re-frame/subscribe [:election-detail/election])]
    [:div
     [breadcrumb election early-vote-site]
     [:h1 "Manage Schedules"]
     [:p "To create a schedule, enter the start and end dates and times.
          You can create multiple schedules for the same site. To associate
          a schedule you previously created with an early vote site, simply
          check the box under 'Assigned.'"]
     [early-vote-site-detail early-vote-site]
     [schedules-list]]))
