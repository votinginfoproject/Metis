(ns early-vote-site.db)

(def default-db
  {:active-panel :election/main
   :elections {:list []
               :form {:state ""
                      :date nil}}})
