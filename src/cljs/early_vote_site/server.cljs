(ns early-vote-site.server)

(defn url
  "Constructs a url back to the server with the given path"
  [path]
  (-> js/window .-location .-origin (str path)))
