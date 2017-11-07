(ns early-vote-site.subs
  (:require [re-frame.core :as re-frame]
            [early-vote-site.elections.subs :as elections]
            [early-vote-site.election-detail.subs :as election-detail]
            [early-vote-site.flash.subs :as flash]
            [early-vote-site.early-vote-site-form.subs :as early-vote-site-form]
            [early-vote-site.early-vote-site-detail.subs
             :as early-vote-site-detail]
            [early-vote-site.modal :as modal]))

(def global-subscriptions
  {:active-panel [:active-panel]
   :username [:user :userName]
   :fips-codes [:user :fipsCodes]
   :roles [:user :roles]})

(defn create-keypath-sub
  [keyword keypath]
  (re-frame/reg-sub
   keyword
   (fn [db] (get-in db keypath))))

(defn create-fn-sub
  [keyword sub-fn]
  (re-frame/reg-sub
   keyword
   sub-fn))

(defn create-sub
  [[keyword sub]]
  (if (sequential? sub)
    (create-keypath-sub keyword sub)
    (create-fn-sub keyword sub)))

(defn create-subscriptions
  [subscription-map]
  (dorun (map create-sub subscription-map)))

(create-subscriptions global-subscriptions)
(create-subscriptions elections/subscriptions)
(create-subscriptions election-detail/subscriptions)
(create-subscriptions early-vote-site-form/subscriptions)
(create-subscriptions early-vote-site-detail/subscriptions)
(create-subscriptions flash/subscriptions)
(create-subscriptions modal/subscriptions)
