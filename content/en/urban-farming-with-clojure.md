---
title: Urban Farming with Clojure
date: 2015-08-09
categories:
- Programming
images:
- "https://cdn.hackaday.io/images/1186661438911748780.JPG"
summary: "Physical world is actually concurrent, thus why not give Clojure a shot?"
---

Currently, I'm developing an indoor farming system to grow vegetables (at the moment is Lettuce) and herbs in my house. You can check the project's progress on [my Hackaday's page](https://hackaday.io/project/7124-tanibox-indoor-farming-system). The system should controls the lighting on and off at the correct time, logs the temperature and humidity and triggers the fan based on it, and sends the farm log to the server, so, I can predict the harvest time and the farm optimal condition in the future. At the heart of the system, I'm using Raspberry Pi as a micro controller.

Physical world is actually concurrent, thus why not give Clojure a shot? It's a good language for handling concurrency, right?

So, here is my first working version of my code for controlling the LED growing lamp.

```
(ns farmbox.lighting
  (:require [clojure.core.async :as a :refer [>! <! >! <!! go chan close!]]
            [gpio.core :as gpio]))

  (def port (gpio/open-port 4))

  (defn switch-on []
    "Switch the lamp on."
    (if (= (gpio/read-value port) :high)
      (do (gpio/set-direction! port :out)
          (gpio/write-value! port :low)
          "Lamp is on")
      "Lamp is on"))

  (defn switch-off []
    "Switch the lamp off."
    (if (= (gpio/read-value port) :low)
      (do (gpio/write-value! port :high)
          (gpio/set-direction! port :in)
          (gpio/close! port)
          "Lamp is off")
      "Lamp is off"))

  (defn lighting-machine []
    "Create the process for turning on/off the lights."
    (let [in (chan)
          out (chan)]
      (go (let [input (<! in)]
        (cond
          (= input "on") (>! out (switch-on))
          (= input "off") (>! out (switch-off)))
          (do (close! in)
              (close! out))))
      [in out]))

(defn plug-the-machine [switch-status]
  "Call the process of lighting here."
  (let [[in out] (lighting-machine)]
    (>!! in switch-status)
    (println (<!! out))))
```

I gave `Lamp is off` and `Lamp is on` string because go channel can't be given `nil` value.

**The drawback of using Clojure in Raspberry Pi**

Although Clojure is good for handling concurrency, but its runtime is too heavy for device with limited resources likes Raspberry Pi. Its startup time can takes around 2 minutes. It won't be a big problem for production, because you only start the app once. Otherwise it will give some pains in the ass when in development phase, the compile time and the startup time are too slow.

In the second iteration, I will try to evaluate NodeJS as the runtime and use ClojureScript for coding it.
