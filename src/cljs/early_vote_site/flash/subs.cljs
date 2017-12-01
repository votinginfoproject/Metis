(ns early-vote-site.flash.subs
  (:require [re-frame.core :as re-frame]))

(def subscriptions
  {:flash/message [:flash :message]
   :flash/error [:flash :error]})
