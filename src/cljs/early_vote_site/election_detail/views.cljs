(ns early-vote-site.election-detail.views
  (:require [cljs-pikaday.reagent :as pikaday]
            [cljs-time.format :as format]
            [early-vote-site.constants :as constants]
            [re-frame.core :as re-frame]
            [reagent.ratom :as ratom]))

(defn main-panel []
  ; (re-frame/dispatch [:elections/list-get])
  (let [election-id @(re-frame/subscribe [:selected-election])]
    (fn []
      [:div
       [:button.button {:on-click #(re-frame/dispatch [:election-detail/go-back])} "test"]
       [:p election-id]
       [:p "on the election-detail page"]])))
