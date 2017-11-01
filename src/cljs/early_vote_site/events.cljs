(ns early-vote-site.events
  (:require [re-frame.core :as re-frame]
            [early-vote-site.db :as db]
            [early-vote-site.election.events :as election]
            [early-vote-site.election-detail.events :as election-detail]
            [early-vote-site.early-vote-site-form.events :as early-vote-form]
            [early-vote-site.early-vote-site-detail.events :as early-vote-site-detail]
            [early-vote-site.flash.events :as flash]))

(defn initialize-db
  [_ _]
  db/default-db)

(defn load-user
  [db _]
  (if-let [user-json (.getItem js/localStorage "auth0_user")]
    (let [user (js->clj (.parse js/JSON user-json) :keywordize-keys true)
          role-set (into #{} (:roles user))
          user-with-roles (assoc user :roles role-set)]
      (assoc db :user user-with-roles))
    db))

(defn close-modal
  [db _]
  (dissoc db :modal))

(def global-events
  {:db {:initialize-db initialize-db
        :load-user load-user
        :close-modal close-modal}})

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

(reg-events global-events)
(reg-events election/events)
(reg-events election-detail/events)
(reg-events early-vote-site-detail/events)
(reg-events early-vote-form/events)
(reg-events flash/events)
