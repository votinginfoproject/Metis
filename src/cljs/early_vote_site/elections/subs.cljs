(ns early-vote-site.elections.subs
  (:require [clojure.string :as string]
            [re-frame.core :as re-frame]))

(def subscriptions
  {:elections/forms [:elections :forms]
   :elections/list [:elections :list]
   :elections/editing [:elections :editing]
   :elections/errors [:elections :errors]})
