(ns early-vote-site.views
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.views :as election]
            [early-vote-site.early-vote-site-form.views
             :as early-vote-site-form]
            [early-vote-site.election-detail.views :as election-detail]
            [early-vote-site.early-vote-site-detail.views
             :as early-vote-site-detail]
            [early-vote-site.flash.views :as flash]))

(defmulti panel identity)
(defmethod panel :election/main [] [election/main-panel])
(defmethod panel :election-detail/main [] [election-detail/main-panel])
(defmethod panel :early-vote-site-form/main [] [early-vote-site-form/main-panel])
(defmethod panel :early-vote-site-detail/main [] [early-vote-site-detail/main-panel])

(enable-console-print!)

(defn render-modal
  [{:keys [title message on-confirm on-cancel]}]
  [:div {:class "modal modal-sm" :style {:display "block" :text-color "#000"} :role "dialog" :id "myModal"}
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
               "Yes"]]]]])

(defn main-panel []
  (let [active-panel (re-frame/subscribe [:active-panel])
        modal @(re-frame/subscribe [:modal])]
    [:div
     (when (seq modal)
      (println "modal:" (pr-str modal))
      [render-modal modal])
     (flash/message)
     (flash/error)
     (panel @active-panel)]))
