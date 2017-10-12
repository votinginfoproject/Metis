(ns early-vote-site.election.events-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [early-vote-site.election.events :as events]))

(deftest election-json->clj
  (testing "converts a json style map to clojure style"
    (is (= {:id 1
            :state-fips "08"
            :election-date "2017-10-10T06:00:00.00Z"}
           (events/election-json->clj
            {"id" 1
             "state_fips" "08"
             "election_date" "2017-10-10T06:00:00.00Z"})))))
