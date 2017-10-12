(ns early-vote-site.election.views-test
  (:require [early-vote-site.election.views :as views]
            [cljs.test :refer-macros [deftest is testing]]))

(deftest format-date-test
  (testing "formats long date to short"
    (let [start-str "2017-10-10T06:00:00.00Z"]
      (is (= "2017-10-10"
             (views/format-date start-str))))))

(deftest format-fips-test
  (testing "formats 08 to Colorado"
    (is (= "Colorado"
           (views/format-fips "08")))))
