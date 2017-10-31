(ns early-vote-site.db)

(def fresh-early-vote-site-form
  {:type "early_vote_site"})

(def fresh-election-form
  {:state "" :date nil})

(def default-db
  (merge
   fresh-early-vote-site-form
   {:active-panel :election/main
    :flash {}
    :selected-election-id nil
    :selected-early-vote-site-id nil
    :elections {:list nil
                :editing #{}
                :forms {:new fresh-election-form}}
    :election-detail {:early-vote-site-list nil
                      :election nil}
    :early-vote-site-form fresh-early-vote-site-form
    :early-vote-site-detail {:early-vote-site nil
                             :editing #{}
                             :schedules nil}}))
