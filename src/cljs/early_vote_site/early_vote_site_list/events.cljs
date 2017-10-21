(ns early-vote-site.early-vote-site-list.events
  (:require [ajax.core :as ajax]
            [early-vote-site.db :as db]))

(defn form-update
  [db [_ field new-value]]
  (assoc-in db [:early-vote-site-form field] new-value))

(defn create-params [db]
  (let [form (:early-vote-site-form db)
        election-id (:selected-election db)]
    {:election_id election-id
     :county_fips (:county-fips form)
     :type        (:type form)
     :name        (:name form)
     :state       (:state form)}))

(defn early-vote-site-base-uri [db]
  (str "http://localhost:4000/earlyvote/elections/"
       (:selected-election db)
       "/earlyvotesites/"))

(defn form-submit
  [{:keys [db]} _]
  (let [params (create-params db)
        create-uri (early-vote-site-base-uri db)]
    {:db db
     :http-xhrio {:method              :post
                  :uri                 create-uri
                  :params              params
                  :timeout             8000
                  :format              (ajax/json-request-format)
                  :response-format     (ajax/json-response-format)
                  :on-success          [:early-vote-site-save/success]
                  :on-failure          [:early-vote-site-save/failure]}}))

(defn save-success [{:keys [db]} [_ result]]
  {:db (assoc db :early-vote-site-form db/fresh-early-vote-site-form)
   :dispatch-n [[:flash/message "Early Vote Site saved"]
                [:early-vote-site-list/get]]})

(defn save-failure [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:flash/error (str "Failed to save Early Vote Site: "
                                (pr-str result))]})

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
  {:id          (get json "id")
   :election-id (get json "election_id")
   :county-fips (get json "county_fips")
   :type        (get json "type")
   :name        (get json "name")
   :state       (get json "state")})

(defn list-success [db [_ result]]
  (assoc db :early-vote-site-list (map early-vote-site-json->clj result)))

(defn list-failure [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:flash/error (str "Failed to load Early Vote Sites: "
                                (pr-str result))]})
