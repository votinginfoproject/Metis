(ns early-vote-site.modal
  (:require [re-frame.core :as re-frame]))

(defn render
  [{:keys [title message on-confirm on-cancel]}]
  [:div {:class "overlay"}
   [:div {:class "modal modal-sm"
          :style {:display "block"
                  :text-color "#000"}
          :role "dialog"}
    [:div {:class "modal-dialog"}
     [:div {:class "modal-content"}
      [:div {:class "modal-header"}
       [:h4 {:class "modal-title"} title]]
      [:div {:class "modal-body"}
       [:p message]]
      [:div {:class "modal-footer"}
        [:button {:type "button" :class "btn btn-default"
                  :on-click on-cancel}
         "No"]
       [:button {:type "button" :class "btn btn-default"
                 :on-click on-confirm}
        "Yes"]]]]]])

(defn add-modal
  [db modal]
  (assoc db :modal modal))

(defn close-modal
  [db _]
  (dissoc db :modal))

(def subscriptions
  {:modal [:modal]})

(def events
  {:db {:close-modal close-modal}})
