(ns early-vote-site.events
  (:require [early-vote-site.authentication :as auth]
            [early-vote-site.config :as config]
            [early-vote-site.db :as db]
            [early-vote-site.elections.events :as elections]
            [early-vote-site.election-detail.events :as election-detail]
            [early-vote-site.early-vote-site-form.events :as early-vote-form]
            [early-vote-site.early-vote-site-detail.events
             :as early-vote-site-detail]
            [early-vote-site.flash.events :as flash]
            [early-vote-site.modal :as modal]
            [early-vote-site.redirect]
            [early-vote-site.server :as server]
            [re-frame.core :as re-frame]))

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

(defn redirect-to-login
  [{:keys [db]} _]
  {:db db
   :redirect (server/origin)})

(def global-events
  {:db {:initialize-db initialize-db
        :load-user load-user}
   :fx {:navigate/login redirect-to-login}})

(defn create-db-event
  [[keyword handler-fn]]
  (re-frame/reg-event-db
   keyword
   [(when config/debug? re-frame.core/debug)]
   handler-fn))

(defn create-fx-event
  [[keyword handler-fn]]
  (re-frame/reg-event-fx
   keyword
   [(when config/debug? re-frame.core/debug)
    (re-frame/inject-cofx :auth0-access-token)
    auth/auth-interceptor]
   handler-fn))

(defn reg-events
  [events-map]
  (dorun (map create-db-event (:db events-map)))
  (dorun (map create-fx-event (:fx events-map))))

(reg-events global-events)
(reg-events elections/events)
(reg-events election-detail/events)
(reg-events early-vote-site-detail/events)
(reg-events early-vote-form/events)
(reg-events flash/events)
(reg-events auth/events)
(reg-events modal/events)
