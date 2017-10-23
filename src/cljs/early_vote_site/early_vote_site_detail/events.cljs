(ns early-vote-site.early-vote-site-detail.events)

(defn navigate
  [{:keys [db]} [_ early-vote-site-id]]
  {:db (-> db
        (assoc :selected-early-vote-site-id early-vote-site-id)
        (assoc :active-panel :early-vote-site/detail))})
