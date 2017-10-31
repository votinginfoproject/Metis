(ns early-vote-site.election.events
  (:require [ajax.core :as ajax]
            [clojure.string :as str]
            [early-vote-site.db :as db]
            [early-vote-site.server :as server]
            [early-vote-site.utils :as utils]
            [re-frame.core :as re-frame]))

(defn navigate
  [{:keys [db]} [_]]
  {:db (assoc db :active-panel :election/main)
   :dispatch [:elections-list/get]})

(defn update-form [db [_ id keyword newval]]
  (assoc-in db [:elections :forms id keyword] newval))

(defn select-election [{:keys [db]} [_ election-id]]
  {:db (assoc-in db [:selected-election-id] election-id)
   :dispatch [:navigate/election-detail]})

(defn create-params [db id]
  {:state_fips (get-in db [:elections :forms id :state])
   :election_date (get-in db [:elections :forms id :date])})

(defn save-url
  [db id]
  (if (= :new id)
    (server/election-url db)
    (server/election-with-id-url id)))

(defn save-method [id]
  (if (= :new id)
    :post
    :put))

(defn save-election
  [{:keys [db]} [_ id]]
  (let [data (create-params db id)]
    {:db db
     :http-xhrio {:method          (save-method id)
                  :uri             (save-url db id)
                  :params          data
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :response-format (ajax/json-response-format)
                  :on-success [:election-save/success id]
                  :on-failure [:election-save/failure]}}))

(defn save-election-success
  [{:keys [db]} [_ id result]]
  {:db (assoc-in db [:elections :forms id] db/fresh-election-form)
   :dispatch-n [[:flash/message "Election saved"]
                [:elections-list/get]
                [:elections/end-edit id]]})

(defn list-elections-params
  [db]
  (let [roles (get-in db [:user :roles])
        fips-code (first (get-in db [:user :fipsCodes]))]
    (when-not (contains? roles "super-admin")
      {:fips (subs fips-code 0 2)})))

(defn get-elections-list
  [{:keys [db]} _]
  (let [data (list-elections-params db)]
    {:db db
     :http-xhrio {:method          :get
                  :uri             (server/election-url db)
                  :params          data
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :response-format (ajax/json-response-format)
                  :on-success [:elections-list-get/success]
                  :on-failure [:elections-list-get/failure]}}))

(defn election-json->clj
  [json]
  {:id (get json "id")
   :state-fips (get json "state_fips")
   :election-date (get json "election_date")})

(defn get-elections-list-success
  [db [_ result]]
  (assoc-in db [:elections :list]
            (map election-json->clj result)))

(defn election->form
  [election]
  {:id (:id election)
   :state (:state-fips election)
   :date (utils/parse-date (:election-date election))})

(defn start-edit
  [db [_ election]]
  (let [id (:id election)]
    (-> db
      (update-in [:elections :editing] conj id)
      (assoc-in [:elections :forms id] (election->form election)))))

(defn end-edit
  [db [_ id]]
  (println "end-edit on " id)
  (-> db
    (update-in [:elections :editing] disj id)
    (update-in [:elections :forms] dissoc id)))

(def events
  {:db {:election-form/update update-form
        :elections-list-get/success get-elections-list-success
        :elections/start-edit start-edit
        :elections/end-edit end-edit}
   :fx {:navigate/elections navigate
        :election-list/election-selected select-election
        :election-form/save save-election
        :election-save/success save-election-success
        :elections-list/get get-elections-list

        :election-save/failure
        (utils/flash-error-with-results "Error saving election")

        :elections-list-get/failure
        (utils/flash-error-with-results "Error loading election list")}})
