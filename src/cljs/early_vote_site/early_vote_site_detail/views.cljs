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

(def not-nil? (complement nil?))
(def not-blank? (complement str/blank?))

(defn valid-schedule-form? [form]
  (and (not-nil? @(:start-date-atom form))
       (not-nil? @(:end-date-atom form))
       (not-blank? @(:start-time-atom form))
       (not-blank? @(:end-time-atom form))
       (not-blank? @(:timezone-atom form))))

(defn schedule-form [& schedule]
  (let [editing? (seq schedule)
        form (if editing?
               (edit-form (first schedule))
               (new-form))]
    (fn []
      [:tr
       [:td [pikaday/date-selector {:class "form-control"
                                    :date-atom (:start-date-atom form)
                                    :max-date-atom (:end-date-atom form)
                                    :pikaday-attrs
                                    {:min-date (js/Date.)
                                     :max-date @(:end-date-atom form)}}]]
       [:td [pikaday/date-selector {:class "form-control"
                                    :date-atom (:end-date-atom form)
                                    :min-date-atom (:start-date-atom form)
                                    :pikaday-attrs
                                    {:min-date (or @(:start-date-atom form)
                                                   (js/Date.))}}]]
       [:td [:input {:type "time"
                     :class "form-control"
                     :value @(:start-time-atom form)
                     :on-change #(reset! (:start-time-atom form)
                                         (-> % .-target .-value))}]]
       [:td [:input {:type "time"
                     :class "form-control"
                     :value @(:end-time-atom form)
                     :on-change #(reset! (:end-time-atom form)
                                         (-> % .-target .-value))}]]
       [:td [:select {:type "text"
                      :class "form-control"
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
       ;; this is gross, but I couldn't get CSS to display buttons inline
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
            "Cancel"])]]])))

(defn schedule->row
  [editing schedule]
  (if (contains? editing (:id schedule))
    [schedule-form schedule]
    [:tr {:key (str "schedule-" (:id schedule))}
     [:td (utils/format-date-string (:start-date schedule))]
     [:td (utils/format-date-string (:end-date schedule))]
     [:td (:start-time schedule)]
     [:td (:end-time schedule)]
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
      [:span
       {:class "btn-link"
        :on-click #(re-frame/dispatch [:schedule/start-edit (:id schedule)])}
       "Edit"]]
     [:td
      [:span
       {:class "btn-link"
        :on-click #(re-frame/dispatch [:schedule/delete-schedule (:id schedule)])}
       "Delete"]]]))

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
      [schedule-form]]]))

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
     [early-vote-site-detail early-vote-site]
     [schedules-list]]))
