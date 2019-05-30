(ns early-vote-site.elections.events
  (:require [ajax.core :as ajax]
            [clojure.string :as str]
            [early-vote-site.db :as db]
            [early-vote-site.modal :as modal]
            [early-vote-site.server :as server]
            [early-vote-site.utils :as utils]
            [re-frame.core :as re-frame]))

;; Navigation

(defn navigate
  [{:keys [db]} [_]]
  {:db (assoc db :active-panel :elections/main)
   :dispatch [:elections-list/get]})

(defn select-election [{:keys [db]} [_ election-id]]
  {:db (assoc-in db [:selected-election-id] election-id)
   :dispatch [:navigate/election-detail]})

;; Create/Edit Forms

(defn update-form [db [_ id keyword newval]]
  (-> db
    (assoc-in [:elections :forms id keyword] newval)
    (update-in [:elections :errors id] dissoc keyword)))

(defn election-params [db id]
  {:state_fips (get-in db [:elections :forms id :state])
   :election_date (get-in db [:elections :forms id :date])})

(defn form-errors [db id]
  (merge
   (when (str/blank? (get-in db [:elections :forms id :state]))
     {:state true})
   (when (str/blank? (get-in db [:elections :forms id :date]))
     {:date true})))

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
  (if-let [errors (form-errors db id)]
    {:db (assoc-in db [:elections :errors id] errors)}
    (let [data (election-params db id)]
      {:db db
       :http-xhrio {:method          (save-method id)
                    :uri             (save-url db id)
                    :params          data
                    :timeout         8000
                    :format          (ajax/json-request-format)
                    :response-format (ajax/json-response-format)
                    :on-success [:election-save/success id]
                    :on-failure [:authorization/check [:election-save/failure]]}})))

(defn save-election-success
  [{:keys [db]} [_ id result]]
  {:db (-> db
           (assoc-in [:elections :forms id] db/fresh-election-form)
           (update-in [:elections :errors] dissoc id))
   :dispatch-n [[:flash/message "Election saved"]
                [:elections-list/get]]})

;; Delete Election

(defn initiate-delete
  [db [_ election]]
  (modal/add-modal
   db
   {:title "Delete Election?"
    :message (str "Do you really want to delete the Election in "
                  (utils/format-fips (:state-fips election)) "?")
    :on-confirm #(re-frame/dispatch [:elections/delete-election (:id election)])
    :on-cancel #(re-frame/dispatch [:close-modal])}))

(defn delete-election
  [{:keys [db]} [_ id]]
  {:db db
   :http-xhrio {:method          :delete
                :uri             (server/election-with-id-url id)
                :timeout         8000
                :format          (ajax/text-request-format)
                :response-format (ajax/json-response-format)
                :on-success [:election-delete/success]
                :on-failure [:election-delete/failure]}})

(defn election-delete-success
  [{:keys [db]} [_ id result]]
  {:db db
   :dispatch-n [[:flash/message "Election deleted"]
                [:close-modal]
                [:elections-list/get]]})

;; Elections List
(defn get-elections-list
  [{:keys [db]} _]
  {:db db
   :http-xhrio {:method          :get
                :uri             (server/election-url db)
                :timeout         8000
                :format          (ajax/json-request-format)
                :response-format (ajax/json-response-format)
                :on-success [:elections-list-get/success]
                :on-failure [:authorization/check [:elections-list-get/failure]]}})

(defn election-json->clj
  [json]
  {:id (get json "id")
   :state-fips (get json "state_fips")
   :election-date (get json "election_date")})

(defn get-elections-list-success
  [db [_ result]]
  (assoc-in db [:elections :list]
            (map election-json->clj result)))

;; Edit Mode

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
  (-> db
    (update-in [:elections :editing] disj id)
    (update-in [:elections :forms] dissoc id)))

;; File Generation

(defn file-generation
  [{:keys [db]} [_ election-id]]
  {:db db
   :http-xhrio {:method          :post
                :uri             (server/file-generate-url election-id)
                :timeout         8000
                :format          (ajax/text-request-format)
                :response-format (ajax/text-response-format)
                :on-success [:flash/message "Files have been generated"]
                :on-failure [:authorization/check [:file-generation/failure]]}})

(def events
  {:db {:election-form/update update-form
        :elections-list-get/success get-elections-list-success
        :elections/start-edit start-edit
        :elections/end-edit end-edit
        :elections/initiate-delete initiate-delete}
   :fx {:navigate/elections navigate
        :election-delete/success election-delete-success
        :elections/delete-election delete-election
        :election-list/election-selected select-election
        :election-form/save save-election
        :election-save/success save-election-success
        :elections-list/get get-elections-list
        :file/generate file-generation
        :election-delete/failure
        (utils/flash-error-with-results "Error deleting election")

        :election-save/failure
        (utils/flash-error-with-results "Error saving election")

        :elections-list-get/failure
        (utils/flash-error-with-results "Error loading election list")

        :file-generation/failure
        (utils/flash-error-with-results "File generation failed, check logs")}})
