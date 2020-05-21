(ns early-vote-site.utils
  (:require [cljs-time.format :as format]
            [cljs-time.coerce :as coerce]
            [clojure.string :as str]
            [early-vote-site.constants :as constants]))

(def full-format (format/formatters :date-time))
(def short-format (format/formatters :date))

(defn format-date-string
  "Translates from a long date string format (ie 2017-10-10T13:23:34.00Z)
   to a short format (2017-10-10)."
  [date-str]
  (let [parsed (format/parse-local full-format date-str)]
    (format/unparse-local short-format parsed)))

(defn format-date
  "Translates from a js date object
   to a short format (2017-10-10)."
  [date]
  (let [coerced (coerce/from-date date)]
    (format/unparse-local short-format coerced)))

(defn parse-date
  "Translates a full date string into a js/Date"
  [date-str]
  (let [parsed (format/parse-local full-format date-str)]
    (coerce/to-date parsed)))

(defn military-to-standard
  [time]
  (let [hour (js/parseInt (subs time 0 2))
        rest (subs time 2 5)
        all (subs time 0 5)]
   (cond
     (> hour 12) (str (mod hour 12) rest " PM")
     (= hour 12) (str all " PM")
     (str/starts-with? all "00") (str "12" (subs all 2 5) " AM")
     (str/starts-with? all "0") (str (subs all 1 5) " AM")
     :else (str all " AM"))))

(defn flash-error-with-results
  [message]
  (fn [{:keys [db]} [_ result]]
    {:db db
     :dispatch [:flash/error message result]}))

(defn schedule->string
  [schedule]
  (str
    (->> (:start-date schedule)
      (format/parse-local full-format)
      (format/unparse-local (format/formatter "MM-dd")))
    " - "
    (->> (:end-date schedule)
      (format/parse-local full-format)
      (format/unparse-local (format/formatter "MM-dd")))
    ", "
    (military-to-standard (:start-time schedule))
    " - "
    (military-to-standard (:end-time schedule))))
