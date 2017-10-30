(ns early-vote-site.subs
  (:require [re-frame.core :as re-frame]
            [early-vote-site.election.subs]
            [early-vote-site.election-detail.subs]
            [early-vote-site.flash.subs]
            [early-vote-site.early-vote-site-form.subs :as evs.form]
            [early-vote-site.early-vote-site-list.subs :as evs.list]
            [early-vote-site.early-vote-site-detail.subs :as evs.detail]))

(re-frame/reg-sub
 :active-panel
 (fn [db]
   (:active-panel db)))

(re-frame/reg-sub
  :username
  (fn [db]
    (get-in db [:user :userName])))

(re-frame/reg-sub
  :fips-codes
  (fn [db]
    (get-in db [:user :fipsCodes])))

(re-frame/reg-sub
  :roles
  (fn [db]
    (get-in db [:user :roles])))

(re-frame/reg-sub
 :early-vote-site-form
 evs.form/form)

(re-frame/reg-sub
 :early-vote-site-list
 evs.list/early-vote-site-list)

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

(create-subscriptions election/subscriptions)
