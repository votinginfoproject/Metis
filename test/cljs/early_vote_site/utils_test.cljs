(ns early-vote-site.utils-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [early-vote-site.utils :as utils]))

(deftest format-date-string-test
  (testing "formats long date to short"
    (let [start-str "2017-10-10T06:00:00.00Z"]
      (is (= "2017-10-10"
             (utils/format-date-string start-str))))))
