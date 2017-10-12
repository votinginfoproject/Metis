(ns early-vote-site.test-runner
  (:require [doo.runner :refer-macros [doo-all-tests]]
            [early-vote-site.election.views-test]
            [early-vote-site.election.events-test]))

(doo-all-tests #"^early-vote-site\..+-test$")
