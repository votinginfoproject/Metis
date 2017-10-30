(ns early-vote-site.flash.events
  (:require [re-frame.core :as re-frame]))

(defn flash-message
  [{:keys [db]} [_ message]]
  {:db (assoc-in db [:flash :message] message)
   :dispatch-later [{:ms 2000 :dispatch [:flash/clear-message]}]})

(enable-console-print!)

(defn flash-error
  [{:keys [db]} [_ message result]]
  {:db (assoc-in db [:flash :error] (str message (pr-str result)))
   :dispatch-later [{:ms 5000 :dispatch [:flash/clear-error]}]})

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
