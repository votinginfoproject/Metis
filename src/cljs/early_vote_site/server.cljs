(ns early-vote-site.server)

(defn url
  "Constructs a url back to the server with the given path"
  [& url-components]
  (let [path (apply str url-components)]
    (-> js/window .-location .-origin (str path))))

(defn election-url
  [db]
  (let [roles (get-in db [:user :roles])
        fips-code (first (get-in db [:user :fipsCodes]))]
    (if (some #{"super-admin"} roles)
      (url "/earlyvote/elections")
      (url "/earlyvote/elections?fips=" (first fips-code) (second fips-code)))))

(defn election-detail-url [db]
  (url "/earlyvote/elections/" (:selected-election-id db)))

(defn election-early-vote-sites-url [db]
  (let [fips-code (first (get-in db [:user :fipsCodes]))]
    (url "/earlyvote/elections/"
         (:selected-election-id db)
         "/earlyvotesites?fips=" fips-code)))

(defn early-vote-site-url [db]
  (url "/earlyvote/earlyvotesites/" (:selected-early-vote-site-id db)))

(defn early-vote-site-url-by-id [id]
  (url "/earlyvote/earlyvotesites/" id))

(defn election-early-vote-site-schedules-url [db]
  (url "/earlyvote/elections/"
       (:selected-election-id db)
       "/earlyvotesites/"
       (:selected-early-vote-site-id db)
       "/schedules"))

(defn assign-schedule-uri [db]
  (url "/earlyvote/earlyvotesites/"
        (:selected-early-vote-site-id db)
        "/assignments/"))

(defn unassign-schedule-uri [assignment-id]
  (str "http://localhost:4000/earlyvote/assignments/" assignment-id))

(defn save-new-schedule-uri [db]
  (url "/earlyvote/elections/" (:selected-election-id db) "/schedules"))
