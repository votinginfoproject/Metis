(ns early-vote-site.views
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.views :as election]
            [early-vote-site.early-vote-site-form.views :as evs.form]
            [early-vote-site.election-detail.views :as election-detail]
            [early-vote-site.early-vote-site-detail.views :as evs.detail]
            [early-vote-site.flash.views :as flash]))

(defmulti panel identity)
(defmethod panel :election/main [] [election/main-panel])
(defmethod panel :election/detail [] [election-detail/main-panel])
(defmethod panel :early-vote-site/form [] [evs.form/main-panel])
(defmethod panel :early-vote-site/detail [] [evs.detail/main-panel])

(defn main-panel []
  (let [active-panel (re-frame/subscribe [:active-panel])]
    (fn []
      [:div
       (flash/message)
       (flash/error)
       (panel @active-panel)])))
