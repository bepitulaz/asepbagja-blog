---
title: Full Stack Clojure Project
date: 2015-05-26
images:
- "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Clojure_logo.svg/500px-Clojure_logo.svg.png"
categories:
- Programming
summary: "Why I'm deeply in love with Clojure? That's because I can do full stack development only in one language."
---

Why I'm deeply in love with Clojure? That's because I can do full stack development only in one language. I can write HTML with the same Clojure data structure, then styling it by writing CSS in exactly the same data structure. When I need to do user interface development, I can use ClojureScript then compile it into JavaScript. Actually writing ClojureScript is more pleasant than writing vanilla JavaScript. How about the backend development? You don't say. Clojure was invented for that purpose.

Here is the content of my `project.clj` for doing full stack Clojure website development:

```
(defproject sample "0.1.0"
  :description "FIXME: description"
  :url "https://asep.co"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.7.0-beta2"]
                 [org.clojure/clojurescript "0.0-3291"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [compojure "1.3.4"]
                 [selmer "0.8.2"]
                 [garden "1.2.5"]
                 [jayq "2.5.4"]
                 [ring "1.4.0-RC1"]]
  :plugins [[lein-ring "0.8.13"]
            [lein-ancient "0.6.7"]
            [lein-cljsbuild "1.0.6"]
            [lein-garden "0.2.6"]]
  :resource-path "resources"
  :aot :all
  :main sample.handler
  :uberjar-name "sample-standalone.jar"
  :ring {:handler sample.handler/app}

  :cljsbuild {:builds [{:source-paths ["src-cljs"]
                        :compiler {:output-to "resources/public/js/main.js"
                               :optimizations :simple
                               :pretty-print true}}]}

  :garden {:builds [{:id "screen"
                     :source-paths ["src-styles"]
                     :stylesheet sample.core/screen
                     :compiler {:output-to "resources/public/css/screen.css"}
                     :pretty-print? true}]}

  :profiles {:dev {:dependencies [[ring-mock "0.1.5"]]
                   :ring {:auto-refresh? true}}})
```

I write CSS code by using [Garden](https://github.com/noprompt/garden). It is fun. Who doesn't want to trade their CSS pre-processor with full fledged programming language? For HTML templating, I usually use [Selmer](https://github.com/yogthos/Selmer) when I collaborate with front-end developer who doesn't speak Clojure. But[Hiccup](https://github.com/weavejester/hiccup) is also good when you want to write HTML in Clojure data structure. If I need to create React application, I will use [Reagent](https://reagent-project.github.io/) library. Frankly, developing React application is more convenience using ClojureScript.

Clojure and ClojureScript really make me a happy developer.
