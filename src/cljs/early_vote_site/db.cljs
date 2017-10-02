(ns early-vote-site.db)

(def default-db
  {:active-panel :election/main
   :flash {}
   :elections {:list []
               :form {:state ""
                      :date nil}}})
