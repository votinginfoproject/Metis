(ns early-vote-site.utils
  (:refer-clojure :exclude [range iterate format max min])
  (:require [cljs-time.format :as format]
    [cljs-time.coerce :as coerce]
    [cljs-time.local :as local]
    [early-vote-site.constants :as constants]))

(def full-format (format/formatters :date-time))
(def full-format-no-ms (format/formatters :date-time-no-ms))
(def short-format (format/formatters :date))
(def time-format (format/formatters :hour-minute))

(defn format-date-string
  "Translates from a long date string format (ie 2017-10-10T13:23:34.00Z)
   to a short format (2017-10-10)."
  [date-str]
  (let [parsed (try
                 (format/parse full-format date-str)
                 (catch :default e (format/parse full-format-no-ms date-str)))]
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
  (let [parsed (try
                 (format/parse full-format date-str)
                 (catch :default e (format/parse full-format-no-ms date-str)))]
    (coerce/to-date parsed)))

(defn format-time-string
  "Translates from a long date string format (ie 2017-10-10T13:23:34.00Z)
   to a short format (12:45)."
  [date-str]
  (let [parsed (try
                 (format/parse full-format date-str)
                 (catch :default e (format/parse full-format-no-ms date-str)))]
    (local/format-local-time parsed :hour-minute)))

(defn flash-error-with-results
  [message]
  (fn [{:keys [db]} [_ result]]
    {:db db
     :dispatch [:flash/error message result]}))

(defn schedule->string
  [schedule]
  (str
    (format-date-string (:start-date schedule))
    " - "
    (format-date-string (:end-date schedule))
    " "
    (format-time-string (:start-time schedule))
    " - "
    (format-time-string (:end-time schedule))))
