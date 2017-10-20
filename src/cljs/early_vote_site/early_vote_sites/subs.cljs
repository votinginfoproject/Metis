(ns early-vote-site.early-vote-sites.subs)

(defn form [db]
  (:early-vote-site-form db))

(defn early-vote-site-list [db]
  (:early-vote-site-list db))
