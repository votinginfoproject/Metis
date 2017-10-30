(ns early-vote-site.events
  (:require [re-frame.core :as re-frame]
            [early-vote-site.db :as db]
            [early-vote-site.election-detail.events :as ed]
            [early-vote-site.election.events :as election]
            [early-vote-site.early-vote-site-form.events :as early-vote-form]
            [early-vote-site.early-vote-site-detail.events :as early-vote-site-detail]
            [early-vote-site.flash.events]))

(re-frame/reg-event-db
 :initialize-db
 (fn  [_ _]
   db/default-db))

(enable-console-print!)
(re-frame/reg-event-db
  :load-user
  (fn [db _]
    (if-let [user-json (.getItem js/localStorage "auth0_user")]
      (let [user (js->clj (.parse js/JSON user-json) :keywordize-keys true)]
        (println "clojurified user: " (pr-str user))
        (assoc db :user user))
      db)))

(re-frame/reg-event-db
 :early-vote-site-form/update
 early-vote-form/form-update)

(re-frame/reg-event-fx
 :early-vote-site-form/save
 early-vote-form/form-submit)

(re-frame/reg-event-fx
 :early-vote-site-save/success
 early-vote-form/save-success)

(re-frame/reg-event-fx
 :early-vote-site-save/failure
 early-vote-form/save-failure)

(re-frame/reg-event-fx
 :get-early-vote-site-data/success
 early-vote-site-form/get-evs-data-success)


(re-frame/reg-event-fx
 :get-early-vote-site-data/failure
 early-vote-site-form/get-evs-data-failure)


(re-frame/reg-event-fx
 :navigate/election-detail
 ed/navigate)

(re-frame/reg-event-fx
 :navigate/early-vote-form
 early-vote-form/navigate)

(re-frame/reg-event-fx
 :navigate/edit-early-vote-form
 early-vote-form/navigate)

(defn create-db-event
  [[keyword handler-fn]]
  (re-frame/reg-event-db
   keyword
   handler-fn))

(defn create-fx-event
  [[keyword handler-fn]]
  (re-frame/reg-event-fx
   keyword
   handler-fn))

(defn reg-events
  [events-map]
  (dorun (map create-db-event (:db events-map)))
  (dorun (map create-fx-event (:fx events-map))))

(reg-events election/events)
(reg-events election-detail/events)
(reg-events early-vote-site-detail/events)
(reg-events flash/events)
