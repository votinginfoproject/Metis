(ns early-vote-site.redirect
  (:require [re-frame.core :as re-frame]))

(enable-console-print!)

(defn redirect
  [url]
  (println "redirecting to" url)
  (set! (.-location js/window) url))

(re-frame/reg-fx :redirect redirect)
