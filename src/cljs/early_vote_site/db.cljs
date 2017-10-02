(ns early-vote-site.db
  (:require [reagent.ratom :as ratom]))

(def default-db
  {:active-panel :election/main
   :flash {}
   :elections {:list []
               :form {:state ""
                      :date (ratom/atom nil)}}})
