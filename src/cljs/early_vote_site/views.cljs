(ns early-vote-site.views
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.views :as election]
            [early-vote-site.early-vote-site-form.views
             :as early-vote-site-form]
            [early-vote-site.election-detail.views :as election-detail]
            [early-vote-site.early-vote-site-detail.views
             :as early-vote-site-detail]
            [early-vote-site.flash.views :as flash]
            [early-vote-site.modal :as modal]))

(defmulti panel identity)
(defmethod panel :election/main [] [election/main-panel])
(defmethod panel :election-detail/main [] [election-detail/main-panel])
(defmethod panel :early-vote-site-form/main [] [early-vote-site-form/main-panel])
(defmethod panel :early-vote-site-detail/main [] [early-vote-site-detail/main-panel])

(defn main-panel []
  (let [active-panel (re-frame/subscribe [:active-panel])
        modal @(re-frame/subscribe [:modal])]
    [:div
     (when (seq modal)
      [modal/render modal])
     (flash/message)
     (flash/error)
     (panel @active-panel)]))
