(ns early-vote-site.db)

(def fresh-early-vote-site-form
  {:early-vote-site-form {:type "early_vote_site"}})

(def default-db
  (merge
   fresh-early-vote-site-form
   {:active-panel :election/main
    :flash {}
    :elections {:list []
                :form {:state ""
                       :date nil}}}))
