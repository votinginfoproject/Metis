(ns early-vote-site.utils
  (:require [cljs-time.format :as format]
            [early-vote-site.constants :as constants]))

(defn format-date
  "Translates from a long date string format (ie 2017-10-10T13:23:34.00Z)
   to a short format (2017-10-10)."
  [date-str]
  (let [full-format (format/formatters :date-time)
        short-format (format/formatters :date)
        parsed (format/parse full-format date-str)]
    (format/unparse short-format parsed)))

(defn format-fips
  "Translates a fips code to state name."
  [fips]
  (get constants/state-names-by-fips fips))
