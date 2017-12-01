(ns early-vote-site.early-vote-site-detail.events-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [clojure.string :as str]
            [early-vote-site.early-vote-site-detail.events :as events]
            [reagent.ratom :as r]))

(deftest form-errors-test
  (testing "errors on all fields"
    (is (= {:start-date true
            :end-date true
            :start-time true
            :end-time true
            :timezone true}
           (events/form-errors
            {:start-date-atom (r/atom nil)
             :end-date-atom (r/atom nil)
             :start-time-atom (r/atom nil)
             :end-time-atom (r/atom nil)
             :timezone-atom (r/atom nil)}))))
  (testing "error on couple of fields"
    (is (= {:timezone true
            :start-time true}
           (events/form-errors
            {:start-date-atom (r/atom "2017-11-06")
             :end-date-atom (r/atom "2017-11-07")
             :start-time-atom (r/atom nil)
             :end-time-atom (r/atom "14:00")
             :timezone-atom (r/atom nil)})))))

(deftest save-schedule-test
  (testing "save new schedule - with form errors"
    (let [form {:start-date-atom (r/atom (js/Date.))
                :end-date-atom (r/atom nil)
                :start-time-atom (r/atom "08:00")
                :end-time-atom (r/atom "14:00")
                :timezone-atom (r/atom nil)}
          db {:early-vote-site-detail {}}
          effects (events/save-schedule db [:event form])]
      (is (not (contains? effects :http-xhrio)))
      (is (= {:end-date true
              :timezone true}
             (get-in effects [:db :early-vote-site-detail :errors :new])))))
  (testing "save new schedule - without form errors"
    (let [start (js/Date. 2017 10 06 0 0 0 0)
          end (js/Date. 2017 11 07 0 0 0 0)
          form {:start-date-atom (r/atom start)
                :end-date-atom (r/atom end)
                :start-time-atom (r/atom "08:00")
                :end-time-atom (r/atom "14:00")
                :timezone-atom (r/atom "MST")}
          db {:early-vote-site-detail {}
              :selected-election-id 123
              :selected-early-vote-site-id 456}
          effects (events/save-schedule {:db db} [:event form])]
      (is (contains? effects :http-xhrio))
      (is (empty? (get-in effects [:db :early-vote-site-detail :errors :new])))
      (is (= :post (get-in effects [:http-xhrio :method])))
      (is (str/ends-with? (get-in effects [:http-xhrio :uri])
                          "/earlyvote/elections/123/schedules"))
      (is (= {:start_date start
              :end_date end
              :start_time "08:00"
              :end_time "14:00"
              :timezone "MST"}
             (get-in effects [:http-xhrio :params])))))
  (testing "save existing schedule - without form errors"
    (let [start (js/Date. 2017 10 06 0 0 0 0)
          end (js/Date. 2017 11 07 0 0 0 0)
          form {:id 789
                :start-date-atom (r/atom start)
                :end-date-atom (r/atom end)
                :start-time-atom (r/atom "08:00")
                :end-time-atom (r/atom "14:00")
                :timezone-atom (r/atom "MST")}
          db {:early-vote-site-detail {}
              :selected-election-id 123
              :selected-early-vote-site-id 456}
          effects (events/save-schedule {:db db} [:event form])]
      (is (contains? effects :http-xhrio))
      (is (empty? (get-in effects [:db :early-vote-site-detail :errors :new])))
      (is (= :put (get-in effects [:http-xhrio :method])))
      (is (str/ends-with? (get-in effects [:http-xhrio :uri])
                          "/earlyvote/schedules/789"))
      (is (= {:start_date start
              :end_date end
              :start_time "08:00"
              :end_time "14:00"
              :timezone "MST"}
             (get-in effects [:http-xhrio :params]))))))
