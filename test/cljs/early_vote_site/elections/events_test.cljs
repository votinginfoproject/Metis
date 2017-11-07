(ns early-vote-site.elections.events-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [early-vote-site.elections.events :as events]))

(deftest create-params-test
  (testing "formats create params"
    (is (= {:state_fips "08"
            :election_date "2017-10-31"}
           (events/create-params {:elections
                                  {:forms
                                   {"test-id" {:state "08"
                                               :date "2017-10-31"}
                                    "other-id" {:state "22"
                                                :date "2017-11-20"}}}}
                                 "test-id")))))

(deftest election-json->clj
  (testing "converts a json style map to clojure style"
    (is (= {:id 1
            :state-fips "08"
            :election-date "2017-10-10T06:00:00.00Z"}
           (events/election-json->clj
            {"id" 1
             "state_fips" "08"
             "election_date" "2017-10-10T06:00:00.00Z"})))))

(deftest list-elections-params-test
  (testing "params are empty for super-admin even with fipsCodes set"
    (let [db {:user {:roles #{"super-admin"}
                     :fipsCodes ["08"]}}]
      (is (empty? (events/list-elections-params db)))))
  (testing "params include fips when not super-admin"
    (let [db {:user {:roles #{"county-data-user"}
                     :fipsCodes ["08005"]}}]
      (is (= {:fips "08"}
             (events/list-elections-params db))))))
