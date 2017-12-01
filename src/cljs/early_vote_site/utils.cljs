(ns early-vote-site.utils
  (:require [cljs-time.format :as format]
            [cljs-time.coerce :as coerce]
            [early-vote-site.constants :as constants]))

(def full-format (format/formatters :date-time))
(def short-format (format/formatters :date))

(defn format-date-string
  "Translates from a long date string format (ie 2017-10-10T13:23:34.00Z)
   to a short format (2017-10-10)."
  [date-str]
  (let [parsed (format/parse full-format date-str)]
    (format/unparse short-format parsed)))

(defn format-date
  "Translates from a js date object
   to a short format (2017-10-10)."
  [date]
  (let [coerced (coerce/from-date date)]
    (format/unparse short-format coerced)))

(defn parse-date
  "Translates a full state string into a js/Date"
  [date-str]
  (let [parsed (format/parse full-format date-str)]
    (coerce/to-date parsed)))

(defn format-fips
  "Translates a fips code to state name."
  [fips]
  (get constants/state-names-by-fips fips))

(defn flash-error-with-results
  [message]
  (fn [{:keys [db]} [_ result]]
    {:db db
     :dispatch [:flash/error message result]}))

(defn schedule->string
  [schedule]
  (str
    (->> (:start-date schedule)
      (format/parse full-format)
      (format/unparse (format/formatter "MM-dd")))
    " - "
    (->> (:end-date schedule)
      (format/parse full-format)
      (format/unparse (format/formatter "MM-dd")))
    " "
    (:start-time schedule)
    " - "
    (:end-time schedule)))
