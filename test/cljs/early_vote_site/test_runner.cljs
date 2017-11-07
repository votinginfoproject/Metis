(ns early-vote-site.test-runner
  (:require [doo.runner :refer-macros [doo-all-tests]]
            [early-vote-site.utils-test]
            [early-vote-site.elections.views-test]
            [early-vote-site.elections.events-test]
            [early-vote-site.election-detail.events-test]
            [early-vote-site.early-vote-site-form.events-test]))

(doo-all-tests #"^early-vote-site\..+-test$")
