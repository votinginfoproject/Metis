(ns early-vote-site.server)

(defn origin []
  (-> js/window .-location .-origin))

(defn url
  "Constructs a url back to the server with the given path"
  [& url-components]
  (let [protocol-and-domain (origin)
        path (apply str url-components)]
    (str protocol-and-domain path)))

(defn election-url
  [db]
  (url "/dasher/elections"))

(defn election-with-id-url
  [id]
  (url "/dasher/elections/" id))

(defn election-detail-url [db]
  (url "/earlyvote/elections/" (:selected-election-id db)))

(defn file-generate-url [id]
  (url "/earlyvote/elections/" id "/generate"))

(defn election-early-vote-sites-url [db]
  (url "/dasher/elections/"
       (:selected-election-id db)
       "/early-vote-sites"))

(defn early-vote-site-url [db]
  (url "/earlyvote/earlyvotesites/" (:selected-early-vote-site-id db)))

(defn early-vote-site-url-by-id [id]
  (url "/dasher/early-vote-sites/" id))

(defn election-early-vote-site-schedules-url [db]
  (url "/dasher/elections/"
       (:selected-election-id db)
       "/early-vote-sites/"
       (:selected-early-vote-site-id db)
       "/schedules"))

(defn assign-schedule-uri [db]
  (url "/dasher/earlyvotesites/"
        (:selected-early-vote-site-id db)
        "/assignments/"))

(defn unassign-schedule-uri [assignment-id]
  (url "/earlyvote/assignments/" assignment-id))

(defn update-schedule-uri [id]
  (url "/dasher/schedules/" id))

(defn save-new-schedule-uri [db]
  (url "/dasher/elections/" (:selected-election-id db) "/schedules"))
