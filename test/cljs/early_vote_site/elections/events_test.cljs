(ns early-vote-site.elections.events-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [clojure.string :as str]
            [early-vote-site.elections.events :as events]))

(deftest election-params-test
  (testing "formats create params"
    (is (= {:state_fips "08"
            :election_date "2017-10-31"}
           (events/election-params {:elections
                                    {:forms
                                     {"test-id" {:state "08"
                                                 :date "2017-10-31"}
                                      "other-id" {:state "22"
                                                  :date "2017-11-20"}}}}
                                   "test-id")))))

(deftest update-form-test
  (testing "updates the current form value"
    (let [db {:elections {:forms {123 {:state nil}}
                          :errors {123 {:state true}}}}
          after (events/update-form db [:event 123 :state "08"])]
      (is (= "08" (get-in after [:elections :forms 123 :state])))
      (testing "clears errors on that field"
        (is (nil? (get-in after [:elections :errors 123 :state])))))))

(deftest form-errors-test
  (let [db {:elections {:forms {1 {:state "08"
                                   :date nil}
                                2 {:state "08"
                                   :date "2017-11-06"}
                                3 {:state nil
                                   :date nil}}}}]
    (testing "empty when no form errors"
      (is (empty? (events/form-errors db 2))))
    (testing "date form error"
      (is (= {:date true} (events/form-errors db 1))))
    (testing "state and date errors"
      (is (= {:date true :state true}
             (events/form-errors db 3))))))

(deftest save-election-test
  (testing "adds form-errors when form incomplete"
    (let [db {:elections {:forms {:new {:state "08"}}}}
          effects (events/save-election {:db db} [:event :new])]
      (is (= {:date true} (get-in effects [:db :elections :errors :new])))
      (is (not (contains? effects :http-xhrio)))))
  (testing "does a post call when id is :new"
    (let [db {:elections {:forms {:new {:state "08"
                                        :date "2017-11-06"}
                                  123 {:state "06"
                                       :date "2017-12-01"}}}}
          effects (events/save-election {:db db} [:event :new])
          http (:http-xhrio effects)]
      (is (not (nil? http)))
      (is (= :post (:method http)))
      (is (str/ends-with? (:uri http) "/earlyvote/elections"))
      (is (= {:state_fips "08"
              :election_date "2017-11-06"}
             (:params http)))))
  (testing "does a put call when id is not :new"
    (let [db {:elections {:forms {:new {:state "08"
                                        :date "2017-11-06"}
                                  123 {:state "06"
                                       :date "2017-12-01"}}}}
          effects (events/save-election {:db db} [:event 123])
          http (:http-xhrio effects)]
      (is (not (nil? http)))
      (is (= :put (:method http)))
      (is (str/ends-with? (:uri http) "/earlyvote/elections/123"))
      (is (= {:state_fips "06"
              :election_date "2017-12-01"}
             (:params http))))))

(deftest election-json->clj
  (testing "converts a json style map to clojure style"
    (is (= {:id 1
            :state-fips "08"
            :election-date "2017-10-10T06:00:00.00Z"}
           (events/election-json->clj
            {"id" 1
             "state_fips" "08"
             "election_date" "2017-10-10T06:00:00.00Z"})))))

(deftest start-edit-test
  (let [election {:id 456
                  :state-fips "08"
                  :election-date "2017-11-06T00:00:00.000-00:00"}
        db {:elections {:editing #{123}
                        :forms {}}}
        after (events/start-edit db [:event election])]
    (testing "adds id to editing set"
      (is (= #{123 456} (get-in after [:elections :editing]))))
    (testing "adds form"
      (let [form (get-in after [:elections :forms 456])]
        (is (= 456 (:id form)))
        (is (= "08" (:state form)))
        (is (not (nil? (:date form))))))))

(deftest end-edit-test
  (let [db {:elections {:editing #{456}
                        :forms {456 {:id 456
                                     :state "08"
                                     :date (js/Date.)}}}}
        after (events/end-edit db [:event 456])]
    (is (not (contains? (get-in after [:elections :editing]) 456)))
    (is (not (contains? (get-in after [:elections :forms]) 456)))))
