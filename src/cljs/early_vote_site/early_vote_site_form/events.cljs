(ns early-vote-site.early-vote-site-form.events
  (:require [ajax.core :as ajax]
            [early-vote-site.constants :as constants]
            [early-vote-site.db :as db]
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

; change active panel on success
(defn get-evs-data-success [{:keys [db]} _]
  {:db (merge db db/fresh-early-vote-site-form)
   :dispatch [:navigate/early-vote-site-form]})

(defn navigate
  [db _]
  (let [roles (get-in db [:user :roles])
        fips (first (get-in db [:user :fipsCodes]))]
    (if (some #{"data-centralization"} roles)
      (-> db (assoc :active-panel :early-vote-site-form/main)
          (assoc-in [:early-vote-site-form :county-fips] fips))
      (assoc db :active-panel :early-vote-site-form/main))))

(defn form-update
  [db [_ field new-value]]
  (assoc-in db [:early-vote-site-form field] new-value))

(defn form->params [form]
  {:county_fips    (:county-fips form)
   :type           (:type form)
   :name           (:name form)
   :address_1      (:address-1 form)
   :address_2      (:address-2 form)
   :address_3      (:address-3 form)
   :city           (:city form)
   :zip            (:zip form)
   :directions     (:directions form)
   :voter_services (:voter-services form)})

(defn create-params [db]
  (let [form (form->params (:early-vote-site-form db))
        fips (get-in db [:election-detail :election :state-fips])
        state (get constants/state-abbreviations-by-fips fips)]
    (merge form {:state state})))

(defn form-submit
  [{:keys [db]} _]
  (let [params (create-params db)
        create-uri (server/election-early-vote-sites-url db)]
    {:db db
     :http-xhrio {:method              :post
                  :uri                 create-uri
                  :params              params
                  :timeout             8000
                  :format              (ajax/json-request-format)
                  :response-format     (ajax/json-response-format)
                  :on-success          [:early-vote-site-save/success]
                  :on-failure          [:early-vote-site-save/failure]}}))

(defn save-success [{:keys [db]} _]
  {:db (merge db db/fresh-early-vote-site-form)
   :dispatch-n [[:flash/message "Early Vote Site saved"]
                [:navigate/election-detail]]})

(def events
  {:db {:early-vote-site-form/update form-update
        :navigate/early-vote-site-form navigate}
   :fx {:navigate/edit-early-vote-form navigate-edit
        :early-vote-site-form/save form-submit
        :early-vote-site-save/success save-success
        :get-early-vote-site-data/success get-evs-data-success
        :get-early-vote-site-data/failure
        (utils/flash-error-with-results "Error retrieving early vote site")
        :early-vote-site-save/failure
        (utils/flash-error-with-results "Error saving early vote site")}})
