(ns early-vote-site.election-detail.subs
  (:require [ajax.core :as ajax]
            [re-frame.core :as re-frame]))

(def subscriptions
  {:election-detail/early-vote-site-list [:election-detail :early-vote-site-list]
   :election-detail/election [:election-detail :election]
   :election-detail/selected-county-fips [:election-detail :selected-county-fips]})
