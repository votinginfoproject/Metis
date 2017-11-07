(ns early-vote-site.election-detail.events
  (:require [ajax.core :as ajax]
            [clojure.set :as set]
            [clojure.string :as str]
            [early-vote-site.modal :as modal]
            [early-vote-site.server :as server]
            [early-vote-site.utils :as utils]
            [re-frame.core :as re-frame]))

(defn navigate
  [{:keys [db]} _]
  {:db (assoc db :active-panel :election-detail/main)
   :dispatch-n [[:election-detail/get]
                [:early-vote-site-list/get]]})

(defn election-detail-json->clj
  [json]
  {:id (get json "id")
   :state-fips (get json "state_fips")
   :election-date (get json "election_date")})

(defn get-election-success
  [db [_ result]]
  (assoc-in db [:election-detail :election]
            (first (map election-detail-json->clj result))))

(defn get-election-detail
  [{:keys [db]} _]
  {:db db
   :http-xhrio {:method          :get
                :uri             (server/election-detail-url db)
                :timeout         8000
                :format          (ajax/json-request-format)
                :response-format (ajax/json-response-format)
                :on-success [:get-election/success]
                :on-failure [:get-election/failure]}})

(defn early-vote-site-list-params
  [db]
  (let [fips-codes (get-in db [:user :fipsCodes])
        roles (get-in db [:user :roles])]
    (when-not (seq (set/intersection roles #{"state-admin" "super-admin"}))
      {:fips (first fips-codes)})))

(defn get-early-vote-site-list
  [{:keys [db]} _]
  {:db db
   :http-xhrio {:method            :get
                :uri               (server/election-early-vote-sites-url db)
                :params            (early-vote-site-list-params db)
                :timeout           8000
                :request-format    (ajax/json-request-format)
                :response-format   (ajax/json-response-format)
                :on-success        [:get-early-vote-site-list/success]
                :on-failure        [:get-early-vote-site-list/failure]}})

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

(defn get-early-vote-site-list-success
  [db [_ result]]
  (assoc-in db [:election-detail :early-vote-site-list]
            (map early-vote-site-json->clj result)))

(defn initiate-delete
  [db [_ {:keys [name id] :as early-vote-site}]]
  (modal/add-modal
   db
   {:title "Delete Early Vote Site?"
    :message (str "Do you really want to delete the early vote site "
                  name "?")
    :on-confirm #(re-frame/dispatch [:early-vote-site/delete id])
    :on-cancel #(re-frame/dispatch [:close-modal])}))

(defn delete-early-vote-site
  [{:keys [db]} [_ id]]
  {:db db
   :http-xhrio {:method          :delete
                :uri             (server/early-vote-site-url-by-id id)
                :timeout         8000
                :format          (ajax/text-request-format)
                :response-format (ajax/json-response-format)
                :on-success [:early-vote-site-delete/success]
                :on-failure [:early-vote-site-delete/failure]}})

(defn early-vote-site-delete-success
  [{:keys [db]} _]
  {:db db
   :dispatch-n [[:flash/message "Early vote site deleted"]
                [:close-modal]
                [:election-detail/get]
                [:early-vote-site-list/get]]})


(def events
  {:db {:get-election/success get-election-success
        :get-early-vote-site-list/success get-early-vote-site-list-success
        :early-vote-site/initiate-delete initiate-delete}
   :fx {:navigate/election-detail navigate
        :election-detail/get get-election-detail
        :early-vote-site-list/get get-early-vote-site-list
        :early-vote-site/delete delete-early-vote-site
        :early-vote-site-delete/success early-vote-site-delete-success
        :early-vote-site-delete/failure
        (utils/flash-error-with-results "Error deleting early vote site")

        :get-early-vote-site-list/failure
        (utils/flash-error-with-results "Error getting early vote sites")

        :get-election/failure
        (utils/flash-error-with-results "Error getting election details")}})
