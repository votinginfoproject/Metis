(ns early-vote-site.election-detail.events
  (:require [ajax.core :as ajax]
            [re-frame.core :as re-frame]
            [clojure.string :as str]))

(defn navigate
  [{:keys [db]} _]
  {:db (assoc db :active-panel :election/detail)
   :dispatch-n [[:election-detail/get-election]
                [:early-vote-site-list/get]]})

(defn get-elections-params
  ; need to flesh this bit out
  [db]
  {})

(defn election-detail-json->clj
  [json]
  {:id (get json "id")
   :state-fips (get json "state_fips")
   :election-date (get json "election_date")})

(re-frame/reg-event-db
 :election-detail/get-election-success
 (fn [db [_ result]]
   (assoc-in db [:election-detail :detail]
             (first (map election-detail-json->clj result)))))

(re-frame/reg-event-db
 :election-detail/get-election-fail
 (fn [db [_ result]]
   (re-frame/dispatch [:flash/error "Could not contact server for elections"])
   db))

(re-frame/reg-event-fx
 :election-detail/get-election
 (fn [{:keys [db]} _]
   (let [election-id (:selected-election db)]
     {:db db
      :http-xhrio {:method          :get
                   :uri             (str "http://localhost:4000/earlyvote/elections/" election-id)
                   :timeout         8000
                   :format          (ajax/json-request-format)
                   :response-format (ajax/json-response-format)
                   :on-success [:election-detail/get-election-success]
                   :on-failure [:election-detail/get-election-fail]}})))

; (re-frame/reg-event-fx
;  :election-detail/get-early-vote-sites
;  (fn [{:keys [db]} _]
;    (let [data (get-elections-params db)]
;      {:db db
;       :http-xhrio {:method          :get
;                    :uri             "http://localhost:4000/earlyvote/elections" ; need to know what the endpoint will be
;                    :params          data
;                    :timeout         8000
;                    :format          (ajax/json-request-format)
;                    :response-format (ajax/json-response-format)
;                    :on-success [:election-detail/get-early-vote-sites-success]
;                    :on-failure [:election-detail/get-early-vote-sites-fail]}})))
;
; (re-frame/reg-event-fx
;  :election-detail/get-schedules
;  (fn [{:keys [db]} _]
;    (let [data (get-elections-params db)]
;      {:db db
;       :http-xhrio {:method          :get
;                    :uri             "http://localhost:4000/earlyvote/elections" ; need to know what the endpoint will be
;                    :params          data
;                    :timeout         8000
;                    :format          (ajax/json-request-format)
;                    :response-format (ajax/json-response-format)
;                    :on-success [:election-detail/get-schedules-success]
;                    :on-failure [:election-detail/get-schedules-fail]}})))
;
; (defn early-vote-sites-json->clj
;   [json]
;   ; need to know what json response will look like
;   {:id (get json "id")
;    :state-fips (get json "state_fips")
;    :election-date (get json "election_date")})
;
; (re-frame/reg-event-db
;  :election-detail/get-early-vote-sites-success
;  (fn [db [_ result]]
;    (assoc-in db [:selected-election :detail]
;              (map election-detail-json->clj result))))
;
; (re-frame/reg-event-db
;  :election-detail/get-early-vote-sites-fail
;  (fn [db [_ result]]
;    (re-frame/dispatch [:flash/error "Could not contact server for early vote sites"])
;    db))
;
; (defn schedules-json->clj
;   [json]
;   ; need to know what json response will look like
;   {:id (get json "id")
;    :state-fips (get json "state_fips")
;    :election-date (get json "election_date")})
;
; (re-frame/reg-event-db
;  :election-detail/get-schedules-success
;  (fn [db [_ result]]
;    (assoc-in db [:selected-election :detail]
;              (map election-detail-json->clj result))))
;
; (re-frame/reg-event-db
;  :election-detail/get-schedules-fail
;  (fn [db [_ result]]
;    (re-frame/dispatch [:flash/error "Could not contact server for schedules"])
;    db))
