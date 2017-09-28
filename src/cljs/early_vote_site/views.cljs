(ns early-vote-site.views
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.views :as election]))

(defmulti panel identity)
(defmethod panel :election/main [] [election/main-panel])

(defn main-panel []
  (let [active-panel (re-frame/subscribe :active-panel)]
    (fn []
      (panel @active-panel))))
