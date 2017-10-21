(ns early-vote-site.early-vote-site-form.events-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [clojure.string :as str]
            [early-vote-site.early-vote-site-form.events :as events]))

(deftest form-update-test
  (testing "updates the form state for the given field"
    (let [db-before {:early-vote-site-form {:name "Hi"}}
          db-after {:early-vote-site-form {:name "Hi"
                                           :county-fips "01234"}}]
      (is (= db-after (events/form-update db-before
                                          [:early-vote-site-form/update
                                           :county-fips
                                           "01234"]))))))

(deftest create-params-test
  (testing "pulls together form and merges state abbreviation"
    (let [db {:election-detail {:detail {:state-fips "08"}}
              :early-vote-site-form {:county-fips "55555"
                                     :type "polling_location"
                                     :name "Test Location"
                                     :address-1 "123 Main St"
                                     :city "Steamboat Springs"
                                     :zip "80487"}}]
      ;; note the transition from clojure style dashes to
      ;; json friendly underscores
      (is (= {:county_fips "55555"
              :type "polling_location"
              :name "Test Location"
              :address_1 "123 Main St"
              :address_2 nil
              :address_3 nil
              :city "Steamboat Springs"
              :state "CO"
              :zip "80487"
              :directions nil
              :voter_services nil}
             (events/create-params db))))))

(deftest form-submit-test
  (testing "constructs the full fx map"
    (let [db {:selected-election "fake-election-id"
              :election-detail {:detail {:state-fips "08"}}
              :early-vote-site-form {:county-fips "55555"
                                     :type "polling_location"
                                     :name "Test Location"
                                     :address-1 "123 Main St"
                                     :city "Steamboat Springs"
                                     :zip "80487"}}
          fx (events/form-submit {:db db} [:early-vote-site-form/save])
          url (get-in fx [:http-xhrio :uri])
          params (get-in fx [:http-xhrio :params])]
      (is (str/ends-with? url "/earlyvote/elections/fake-election-id/earlyvotesites/"))
      (is (= {:county_fips "55555"
              :type "polling_location"
              :name "Test Location"
              :address_1 "123 Main St"
              :address_2 nil
              :address_3 nil
              :city "Steamboat Springs"
              :state "CO"
              :zip "80487"
              :directions nil
              :voter_services nil}
             params)))))

(deftest save-success-test
  (testing "save event"
    (let [db {:selected-election "fake-election-id"
              :election-detail {:detail {:state-fips "08"}}
              :early-vote-site-form {:county-fips "55555"
                                     :type "polling_location"
                                     :name "Test Location"
                                     :address-1 "123 Main St"
                                     :city "Steamboat Springs"
                                     :zip "80487"}}
          fx (events/save-success {:db db} [])]
      (testing "cleared the form"
        (let [db-after (:db fx)]
          (is (= {} (:early-vote-site-form db-after)))))
      (testing "dispatches flash"
        (is (>= (.indexOf (:dispatch-n fx)
                          [:flash/message "Early Vote Site saved"])
                0)))
      (testing "dispatches navigation to election-detail"
        (is (>= (.indexOf (:dispatch-n fx)
                          [:navigate/election-detail])
                0))))))
