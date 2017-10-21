(ns early-vote-site.early-vote-site-form.events
  (:require [ajax.core :as ajax]
            [early-vote-site.constants :as constants]
            [early-vote-site.db :as db]
            [early-vote-site.server :as server]))

(defn navigate
  [{:keys [db]} [_ id]]
  {:db (assoc db :active-panel :early-vote-site/form)})

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
        fips (get-in db [:election-detail :detail :state-fips])
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

(defn save-success [{:keys [db]} [_ result]]
  {:db (assoc db :early-vote-site-form db/fresh-early-vote-site-form)
   :dispatch-n [[:flash/message "Early Vote Site saved"]
                [:navigate/election-detail]]})

(defn save-failure [{:keys [db]} [_ result]]
  {:db db
   :dispatch [:flash/error (str "Failed to save Early Vote Site: "
                                (pr-str result))]})
