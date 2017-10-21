(ns early-vote-site.server)

(defn url
  "Constructs a url back to the server with the given path"
  [path]
  (-> js/window .-location .-origin (str path)))

(defn election-early-vote-sites-url [db]
  (str "http://localhost:4000/earlyvote/elections/"
       (:selected-election db)
       "/earlyvotesites/"))
