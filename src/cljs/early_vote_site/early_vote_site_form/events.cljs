(ns early-vote-site.early-vote-site-form.events
  (:require [ajax.core :as ajax]
            [early-vote-site.constants :as constants]
            [early-vote-site.db :as db]
            [early-vote-site.election-detail.events :as election-detail]
            [early-vote-site.server :as server]
            [early-vote-site.utils :as utils]))

; make request for evs data using id
(defn navigate-edit
  [{:keys [db]} [_ id]]
  (let [get-uri (server/early-vote-site-url-by-id id)]
    {:db db
     :http-xhrio {:method              :get
                  :uri                 get-uri
                  :params              {}
                  :timeout             8000
                  :format              (ajax/json-request-format)
                  :response-format     (ajax/json-response-format)
                  :on-success          [:get-early-vote-site-data/success]
                  :on-failure          [:get-early-vote-site-data/failure]}}))
; populate data into form values in db
; will have an id that's not in the normal form
; have button event check if id is populate to change request type

(defn early-vote-site-json->form
  [json]
  (let [early-vote-site-clj (election-detail/early-vote-site-json->clj json)]
    early-vote-site-clj))

; change active panel on success
(defn get-evs-data-success
  [{:keys [db]} [_ result]]
  (let [form (early-vote-site-json->form (first result))]
    {:db (assoc db :early-vote-site-form form)
     :dispatch [:navigate/early-vote-site-form]}))

(defn navigate
  [db _]
  (let [roles (get-in db [:user :roles])
        fips (first (get-in db [:user :fipsCodes]))]
    (if (contains? roles "data-centralization")
      (-> db (assoc :active-panel :early-vote-site-form/main)
          (assoc-in [:early-vote-site-form :county-fips] fips))
      (assoc db :active-panel :early-vote-site-form/main))))

(defn form-update
  [db [_ field new-value]]
  (assoc-in db [:early-vote-site-form field] new-value))

(defn form->params [form]
  (merge
    (when (contains? form :id)
      {:id (:id form)})
    {:county_fips    (:county-fips form)
     :type           (:type form)
     :name           (:name form)
     :address_1      (:address-1 form)
     :address_2      (:address-2 form)
     :address_3      (:address-3 form)
     :city           (:city form)
     :zip            (:zip form)
     :directions     (:directions form)
     :voter_services (:voter-services form)}))

(defn params [db]
  (let [form (form->params (:early-vote-site-form db))
        fips (get-in db [:election-detail :election :state-fips])
        state (get constants/state-abbreviations-by-fips fips)]
    (merge form {:state state})))

(defn submit-uri [params db]
  (if (contains? params :id)
    (server/early-vote-site-url-by-id (:id params))
    (server/election-early-vote-sites-url db)))

(defn form-submit
  [{:keys [db]} _]
  (let [params (params db)
        uri (submit-uri params db)
        method (if (contains? params :id) :put :post)]
    {:db db
     :http-xhrio {:method              method
                  :uri                 uri
                  :params              params
                  :timeout             8000
                  :format              (ajax/json-request-format)
                  :response-format     (ajax/json-response-format)
                  :on-success          [:early-vote-site-save/success]
                  :on-failure          [:early-vote-site-save/failure]}}))

(defn save-success [{:keys [db]} _]
  {:db (assoc db :early-vote-site-form db/fresh-early-vote-site-form)
   :dispatch-n [[:flash/message "Early Vote Site saved"]
                [:navigate/election-detail]]})

(def events
  {:db {:early-vote-site-form/update form-update
        :navigate/early-vote-site-form navigate}
   :fx {:navigate/edit-early-vote-site-form navigate-edit
        :early-vote-site-form/save form-submit
        :early-vote-site-save/success save-success
        :get-early-vote-site-data/success get-evs-data-success
        :get-early-vote-site-data/failure
        (utils/flash-error-with-results "Error retrieving early vote site")
        :early-vote-site-save/failure
        (utils/flash-error-with-results "Error saving early vote site")}})
