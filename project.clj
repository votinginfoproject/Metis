(defproject early-vote-site "0.1.0-SNAPSHOT"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.9.908"]
                 [cljs-ajax "0.7.2"]
                 [cljs-pikaday "0.1.4"]
                 [com.andrewmcveigh/cljs-time "0.5.0"]
                 [day8.re-frame/http-fx "0.1.4"]
                 [re-frame "0.10.1"]
                 [reagent "0.7.0"]]

  :plugins [[lein-cljsbuild "1.1.5"]]

  :min-lein-version "2.5.3"

  :source-paths ["src/clj"]

  :resource-paths ["resources" "."]

  :clean-targets ^{:protect false} ["public/assets/js/compiled" "target"]

  :figwheel {:css-dirs ["resources/public/css"]
             :http-server-root "public"}

  :profiles
  {:dev
   {:dependencies [[binaryage/devtools "0.9.4"]
                   [com.cemerick/piggieback "0.2.1"]
                   [figwheel-sidecar "0.5.8"]]
    :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}
    :plugins      [[lein-figwheel "0.5.13"]]}}


  :cljsbuild
  {:builds
   [{:id           "dev"
     :source-paths ["src/cljs"]
     :figwheel     {:on-jsload "early-vote-site.core/mount-root"
                    :autoload false}
     :compiler     {:main                 early-vote-site.core
                    :output-to            "public/assets/js/compiled/early_vote.js"
                    :output-dir           "public/assets/js/compiled/out"
                    :asset-path           "assets/js/compiled/out"
                    :source-map-timestamp true
                    :optimizations        :none
                    :preloads             [devtools.preload]
                    :external-config      {:devtools/config {:features-to-install :all}}}}


    {:id           "min"
     :source-paths ["src/cljs"]
     :compiler     {:main            early-vote-site.core
                    :output-to       "public/assets/js/compiled/early_vote_min.js"
                    :optimizations   :advanced
                    :closure-defines {goog.DEBUG false}
                    :pretty-print    false}}]})
