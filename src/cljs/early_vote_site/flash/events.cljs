(ns early-vote-site.flash.events
  (:require [early-vote-site.config :as config]
            [re-frame.core :as re-frame]))

(defn flash-message
  [{:keys [db]} [_ message]]
  {:db (assoc-in db [:flash :message] message)
   :dispatch-later [{:ms 2000 :dispatch [:flash/clear-message]}]})

(defn flash-error
  [{:keys [db]} [_ message result]]
  (let [msg (if config/debug?
              (str message (pr-str result))
              message)
        close-delay (if config/debug? 10000 4000)]
    {:db (assoc-in db [:flash :error] msg)
     :dispatch-later [{:ms close-delay :dispatch [:flash/clear-error]}]}))

(defn clear-message
  [db _]
  (update db :flash dissoc :message))

(defn clear-error
  [db _]
  (update db :flash dissoc :error))

(def events
  {:db {:flash/clear-message clear-message
        :flash/clear-error clear-error}
   :fx {:flash/message flash-message
        :flash/error flash-error}})
