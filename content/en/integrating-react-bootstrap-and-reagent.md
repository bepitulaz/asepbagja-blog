---
title: Integrating React Bootstrap and Reagent
date: 2015-05-11
categories:
- Programming
images:
- "https://raw.githubusercontent.com/cljs/logo/master/cljs-white.png"
summary: "Integrating React Bootstrap and Reagent was confusing me at the first."
---

This weekend, I am experimenting to use [React Bootstrap](http://react-bootstrap.github.io/) with ClojureScript. For whom that doesn't know it yet, React Bootstrap is a [Bootstrap 3](http://getbootstrap.com/) component built with [ReactJS](http://facebook.github.io/react/). I'm using [Reagent](https://reagent-project.github.io/) library for interacting with React from ClojureScript, instead of [Om](https://github.com/omcljs/om).

Integrating React Bootstrap and Reagent was confusing me at the first. It was non-trivial effort. I searched Google and got no relevant solutions for hours. So, this working solution is based on my trial and error experimentation.

Let's start.

In `project.clj` file, I use Reagent with `:exclusions`, because I have to use React version from NPM not the version that comes from Reagent. Don't forget to create `react.cljs` which contains only `(ns cljsjs.react)`.

`project.clj`
```
(defproject sample "0.1.0-SNAPSHOT"
  :description "Write your definition here."
  :url "http://sample.org"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0-beta2"]
                 [org.clojure/clojurescript "0.0-3269"]
                 [reagent "0.5.0" :exclusions  [cljsjs/react]]]
  :node-dependencies [[react-bootstrap "0.21.2"]]
  :plugins [[lein-cljsbuild "1.0.5"]
            [lein-npm "0.5.0"]]
  :source-paths  ["src-clj"]
  :resource-path "resources"
  :npm-root "resources"
  :cljsbuild {:builds [{:source-paths ["src-cljs"]
                        :compiler {:output-to "resources/main.js"
                        :optimizations :advanced
                        :pretty-print true}}]})
```
`react.cljs`
```
(ns cljsjs.react)
```
Now, look at the index.html file. I use React and React Bootstrap which come from NPM. I manage the NPM dependencies by using [lein-npm](https://github.com/RyanMcG/lein-npm). It is a good Leiningen plugin for integrating NPM and Leiningen seamlessly.

`index.html`

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <title>Sample</title>

    <link rel="stylesheet" href="css/bootstrap.min.css">
  </head>

  <body>
    <div id="apps" class="container-fluid"></div>

    <script type="text/javascript" src="react.min.js"></script>
    <script type="text/javascript" src="react-bootstrap.min.js"></script>
    <script type="text/javascript" src="main.js"></script>
  </body>
</html>
```

Finally in `core.cljs`, I can do JS interop to call React component from React Bootstrap module.

`core.cljs`

```
(ns sample.core
  (:require [cljsjs.react]
            [reagent.core :as reagent :refer [atom]]))

(defn text-editor
  "Text editor for static blog."
  []
  (let [grid (aget js/ReactBootstrap "Grid")
        row (aget js/ReactBootstrap "Row")
        col (aget js/ReactBootstrap "Col")]
    (reagent/create-element grid #js{}
      (reagent/create-element row #js{}
        (reagent/create-element col #js{:xs 6 :md 6}

          ;; create div for text editor
          (reagent/create-element "div" #js{:contentEditable true} "Left column"))
          (reagent/create-element col #js{:xs 6 :md 6} "Right column")))))

(reagent/render [text-editor] (.getElementById js/document "apps"))
```

This is my working project structure for doing all those thing.

```
doc
resources
-- node_modules
---- react-bootstrap
---- react
-- index.html
-- main.js
src-clj
src-cljs
-- cljsjs
---- react.cljs
-- sample
---- core.cljs
target
test
project.clj
```
