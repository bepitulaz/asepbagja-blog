---
title: Simple, Cheap, and Scalable IoT Data Logging With Clojure
date: 2015-12-08
categories:
- Programming
images:
- "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Clojure_logo.svg/500px-Clojure_logo.svg.png"
summary: "The concept is simple. Just catch the string from the sensor, transform it into Clojure data structure."
---

I have a small green house in [my home front yard](https://www.asepbagja.com/personal/my-familys-journey-to-grow-our-own-food/), and I deployed some sensors like temperature, humidity, electrical conductivity (EC), and pH sensor there.

After the development of the sensors completed, it was the time for me to develop the web service for logging the data. I considered to use NoSQL database for persistent data storage. Otherwise I dismissed that idea for the sake of cost efficiency.

To use NoSQL database, I should open one or two servers in cloud provider for running it. As we know, the cost for compute engine is charged per hour. Let's pick AWS EC2 for the example. T2.small instance pricing is $0.04/hour. That's too expensive for non-profit purpose.

**The solution**

I decided to make my own NoSQL solution. Persisted all data logs to plain text and put it on AWS S3. That's cheaper, because S3 is storage server and it is charged per GB. For the first 1 TB, it only costs me $0.02/GB. It will takes a long time to reach 1 GB, if only for saving plain text.

The concept is simple. Just catch the string from the sensor, transform it into Clojure data structure, and save it inside the plain text file. To query it back, I just need to read the plain text file, transform the string back into Clojure data structure, and do the computation.

Here is the snippet code for writing and querying the data.

```
(ns data-logging.core
  (:require [clojure.string :as str]
            [clojure.walk :as walk]
            [clojure.java.io :as io]
            [clj-time.coerce :as coerce]
            [clj-time.local :as l]))

(defn data-parser
  "Parsing data from sensor."
  [raw-string]
  (let [split-data (str/split raw-string #",")
        flatten-data (->
                      (map #(str/split % #"=") split-data)
                      (flatten))]
    (-> (apply hash-map flatten-data)
        (walk/keywordize-keys))))

(defn write-today-log
  "Write today log file."
  [sensor-data file-name]
  ;; check if file already exist
  (if (io/.exists (io/as-file file-name))
    ;; exist: append new hash map to vector.
    (let [existing-data (read-string (slurp file-name))]
      (spit file-name
            (with-out-str
              (pr
               (conj existing-data (data-parser sensor-data))))))
    ;; not exist: create new file and insert the vector of hash map.
    (spit file-name
          (with-out-str
            (pr (conj [] (data-parser sensor-data)))))))

(defn search-log
  "Search data between two times."
  [start-time end-time file-name]
  ;; update the date time string to timestamp
  (let [log-data (read-string (slurp file-name))
        with-timestamp (map
                        #(update-in % [:datetime] coerce/to-long)
                        log-data)]
    ;; let's find the data!
    (let [result (filter #(and
                           (> (:datetime %) (coerce/to-long start-time))
                           (< (:datetime %) (coerce/to-long end-time)))
                         with-timestamp)]
      ;; here is the result
      (map #(update-in % [:datetime]
                       (fn [x]
                         (l/format-local-time
                          (coerce/from-long x)
                          :mysql))) result))))
```

This is how to use it.

```
;; Saving the sensor data
(write-today-log "sensorid=123,temp=31.52,humidity=45.4,datetime=2015-12-08 17:31:30" "today-2015-12-08.log")

;; Querying the data
(search-log "2015-12-08 14:00:00" "2015-12-08 19:00:00" "today-2015-12-08.log")
```

Someday if I can get profit from my greenhouse and I need to scale this system, I just need to export the log into another data storage technology. It's simple, cheap, and scalable.
