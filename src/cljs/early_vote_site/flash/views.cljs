(ns early-vote-site.flash.views
  (:require [re-frame.core :as re-frame]))

(defn message []
  (let [message (re-frame/subscribe [:flash/message])]
    (when @message
      [:div {:class "alert alert-success" :role "alert"} @message])))

(defn error []
  (let [error (re-frame/subscribe [:flash/error])]
    (when @error
      [:div {:class "alert alert-danger" :role "alert"} @error])))
