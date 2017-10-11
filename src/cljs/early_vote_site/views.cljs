(ns early-vote-site.views
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.views :as election]
            [early-vote-site.flash.views :as flash]))

(defmulti panel identity)
(defmethod panel :election/main [] [election/main-panel])

(defn main-panel []
  (let [active-panel (re-frame/subscribe [:active-panel])]
    (fn []
      [:div
       (flash/message)
       (flash/error)
       (panel :election/main)])))
