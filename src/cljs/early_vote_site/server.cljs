(ns early-vote-site.server)

(defn url
  "Constructs a url back to the server with the given path"
  [path]
  (-> js/window .-location .-origin (str path)))

(defn election-url
  [db]
  (let [roles (get-in db [:user :roles])
        fips-code (first (get-in db [:user :fipsCodes]))]
    (if (some #{"super-admin"} roles)
      (str "http://localhost:4000/earlyvote/elections")
      (str "http://localhost:4000/earlyvote/elections?fips=" (str (first fips-code) (second fips-code))))))

(defn election-early-vote-sites-url
  [db]
  (let [fips-code (first (get-in db [:user :fipsCodes]))]
    (str "http://localhost:4000/earlyvote/elections/"
         (:selected-election db)
         "/earlyvotesites?fips=" fips-code)))

(defn early-vote-site-url [db]
  (str "http://localhost:4000/earlyvote/earlyvotesites/"
       (:selected-early-vote-site-id db)))

(defn election-early-vote-site-schedules-url [db]
  (str "http://localhost:4000/earlyvote/elections/"
       (:selected-election db)
       "/earlyvotesites/"
       (:selected-early-vote-site-id db)
       "/schedules"))

(defn assign-schedule-uri [db]
  (str "http://localhost:4000/earlyvote/earlyvotesites/"
        (:selected-early-vote-site-id db)
        "/assignments/"))

(defn unassign-schedule-uri [assignment-id]
  (str "http://localhost:4000/earlyvote/assignments/"
       assignment-id))

(defn save-new-schedule-uri [db]
  (str "http://localhost:4000/earlyvote/elections/"
       (:selected-election db)
       "/schedules"))
