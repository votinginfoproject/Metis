(ns early-vote-site.election.subs
  (:require [clojure.string :as string]
            [re-frame.core :as re-frame]))

(def subscriptions
  {:election-forms [:elections :forms]
   :elections/list [:elections :list]
   :elections/editing [:elections :editing]
   :elections/errors [:elections :errors]})
