(ns early-vote-site.authentication
  (:require [clojure.string :as string]
            [early-vote-site.server :as server]
            [re-frame.core :as re-frame]))

(defn get-access-token
  "Retrieves the access token from local storage"
  [coeffects _]
  (if-let [token (.getItem js/localStorage "auth0_access_token")]
    (assoc coeffects :auth0-access-token token)
    coeffects))

(defn add-authorization-header
  "If there's an auth0 access token in the coeffects,
   and there's an :http-xhrio in the effects, and
   the uri matches the origin, then adds the
   authorization header to the http-xhrio headers
   to authorize with the backend."
  [{:keys [coeffects effects] :as context}]
     (if (and (contains? coeffects :auth0-access-token)
              (contains? effects :http-xhrio)
              (string/starts-with? (get-in effects [:http-xhrio :uri])
                                   (server/origin)))
       (let [token (:auth0-access-token coeffects)
             http-xhrio (:http-xhrio effects)
             auth-header {"Authorization" (str "Bearer " token)}]
         (update-in context [:effects :http-xhrio :headers] merge auth-header))
       context))

(re-frame/reg-cofx
 :auth0-access-token
 get-access-token)

(def auth-interceptor
  (re-frame/->interceptor
   :id :auth0-auth-interceptor
   :after add-authorization-header))

(defn check-authorization
  "An fx handler that checks the result for a 401, and if found,
   dispatches a :navigate/login event, otherwise dispatches the
   original on-error event"
  [{:keys [db]} [_ on-failure result]]
  (if (= 401 (:status result))
    {:db db
     :dispatch [:navigate/login]}
    {:db db
     :dispatch (conj on-failure result)}))

(def events
  {:db {}
   :fx {:authorization/check check-authorization}})
