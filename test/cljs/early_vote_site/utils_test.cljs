(ns early-vote-site.utils-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [early-vote-site.utils :as utils]))

(deftest format-date-string-test
  (testing "formats long date to short"
    (let [start-str "2017-10-10T06:00:00.00Z"]
      (is (= "2017-10-10"
             (utils/format-date-string start-str))))))

(deftest military-to-standard
  (testing "pm times are formatted correctly"
    (let [time "16:00:00"]
      (is (= "4:00 PM"
            (utils/military-to-standard time)))))
  (testing "noon is formatted correctly"
    (let [time "12:00:00"]
      (is (= "12:00 PM"
            (utils/military-to-standard time)))))
  (testing "midnight is formatted correctly"
    (let [time "00:00:00"]
      (is (= "12:00 AM"
            (utils/military-to-standard time)))))
  (testing "single-digit hours are formatted correctly"
    (let [time "09:00:00"]
      (is (= "9:00 AM"
            (utils/military-to-standard time)))))
  (testing "double-digit morning hours are formatted correctly"
    (let [time "10:00:00"]
      (is (= "10:00 AM"
            (utils/military-to-standard time))))))
