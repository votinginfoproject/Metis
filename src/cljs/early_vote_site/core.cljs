(ns early-vote-site.core
  (:require [reagent.core :as reagent]
            [re-frame.core :as re-frame]
            [day8.re-frame.http-fx]
            [early-vote-site.events]
            [early-vote-site.subs]
            [early-vote-site.views :as views]
            [early-vote-site.config :as config]))


(defn dev-setup []
  (when config/debug?
    (enable-console-print!)
    (println "dev mode")))

(defn mount-root []
  (re-frame/clear-subscription-cache!)
  (reagent/render [views/main-panel]
                  (.getElementById js/document "app")))

(defn ^:export init []
  (re-frame/dispatch-sync [:initialize-db])
  (re-frame/dispatch-sync [:load-user])
  (re-frame/dispatch [:navigate/elections])
  (dev-setup)
  (mount-root))
