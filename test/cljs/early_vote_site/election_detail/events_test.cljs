(ns early-vote-site.election-detail.events-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [clojure.string :as str]
            [early-vote-site.election-detail.events :as events]))

(deftest get-early-vote-site-list-test
  (testing "constructs uri with election-id"
    (let [db {:selected-election "fake-election-id"}
          fx (events/get-early-vote-site-list {:db db} [])
          uri (get-in fx [:http-xhrio :uri])]
      (is (str/ends-with? uri "/earlyvote/elections/fake-election-id/earlyvotesites/")))))

(deftest election-detail-json->clj-test
  (testing "json converts to clj"
    (let [json {"id"            "fake-id"
                "state_fips"    "08"
                "election_date" "2017-10-13"}]
      (is (= {:id            "fake-id"
              :state-fips    "08"
              :election-date "2017-10-31"}
             (election-detail-json->clj json))))))

(deftest early-vote-site-json->clj-test
  (testing "json converts to clj"
    (let [json {"id"          "fake-id"
                "election_id" "fake-election-id"
                "county_fips" "01234"
                "type"        "drop_box"
                "name"        "Blockbuster Rental Box"
                "address_1"   "123 Main St"
                "city"        "Steamboat Springs"
                "state"       "CO"
                "zip"         "80487"}]
      (is (= {:id             "fake-id"
              :election-id    "fake-election-id"
              :county-fips    "01234"
              :type           "drop_box"
              :name           "Blockbuster Rental Box"
              :address-1      "123 Main St"
              :address-2      nil
              :address-3      nil
              :city           "Steamboat Springs"
              :state          "CO"
              :zip            "80487"
              :directions     nil
              :voter-services nil}
             (events/early-vote-site-json->clj json))))))
