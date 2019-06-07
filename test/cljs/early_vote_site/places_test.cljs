(ns early-vote-site.places-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [early-vote-site.places :as places]))

(deftest fips-name-test
  (testing "08 is Colorado"
    (is (= "Colorado"
           (places/fips-name "08"))))
  (testing "08 001 is Adams County"
    (is (= "Adams County"
           (places/fips-name "08" "001"))))
  (testing "08 400 is not a match"
    (is (= "08400"
           (places/fips-name "08" "400")))))
