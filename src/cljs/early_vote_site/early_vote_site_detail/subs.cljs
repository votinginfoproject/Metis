(ns early-vote-site.early-vote-site-detail.subs)

(defn schedules [db]
  (:schedules db))

(defn selected-early-vote-site-id [db]
  (:selected-early-vote-site-id db))

(defn selected-early-vote-site [db]
  (:selected-early-vote-site db))

(defn selected-early-vote-site-schedules [db]
  (:selected-early-vote-site-schedules db))
