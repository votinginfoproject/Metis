(ns early-vote-site.early-vote-site-list.events
  (:require [ajax.core :as ajax]
            [re-frame.core :as re-frame]))

;;todo move this to server namespace when merged in
(defn early-vote-site-base-uri [db]
  (str "http://localhost:4000/earlyvote/elections/"
       (:selected-election db)
       "/earlyvotesites/"))

(defn list-early-vote-sites
  [{:keys [db]} _]
  (let [list-uri (early-vote-site-base-uri db)]
    {:db db
     :http-xhrio {:method            :get
                  :uri               list-uri
                  :timeout           8000
                  :request-format    (ajax/json-request-format)
                  :response-format   (ajax/json-response-format)
                  :on-success        [:early-vote-site-list/success]
                  :on-failure        [:early-vote-site-list/failure]}}))

(defn early-vote-site-json->clj
  [json]
  {:id             (get json "id")
   :election-id    (get json "election_id")
   :county-fips    (get json "county_fips")
   :type           (get json "type")
   :name           (get json "name")
   :address-1      (get json "address_1")
   :address-2      (get json "address_2")
   :address-3      (get json "address_3")
   :city           (get json "city")
   :state          (get json "state")
   :zip            (get json "zip")
   :directions     (get json "directions")
   :voter-services (get json "voter_services")})

(defn list-success [db [_ result]]
  (assoc db :early-vote-site-list (map early-vote-site-json->clj result)))

(defn list-failure [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:flash/error (str "Failed to load Early Vote Sites: "
                                (pr-str result))]})
