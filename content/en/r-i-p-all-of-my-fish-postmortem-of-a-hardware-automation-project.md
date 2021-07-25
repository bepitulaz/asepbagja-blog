---
title: R.I.P All of My Fish. Postmortem of A Hardware Automation Project
date: 2015-07-21
categories:
- Programming
images:
- "/blog-img/aquarium-post-mortem.jpeg"
summary: "One of the biggest problem of having pet is filling its needs while the owner leaving the home."
---

_One of the biggest problem of having pet is filling its needs while the owner leaving the home._

I had an aquarium which was filled with 7 fish, and the fish should be fed at least once a day or better twice a day in small portion. A week ago, I and my wife must left our home for celebrating Eid together at my parent's home in another town, thus it led me for creating an automation system to feed my fish.

Three days before the departure, I started to create it. I have an Arduino Uno R3, an ESP8266 wifi module, a Tower Pro SG90 micro servo, and a Starbucks' juice bottle as a fish food container. My first design was making a system that can tell me via email if it successfully feeds the fish twice a day, but then I remembered that my current home doesn't has always-on-internet. So, I ditched the email feature and surely I didn't need to use ESP8266.

Then I moved with second design. The Arduino would be rotating the servo twice a day without notified me whether it fed the fish successfully or not. I tested it several times, and 150% sure that this device worked with zero bug in code.

![working-design](/blog-img/aquarium-post-mortem.jpeg)

I left my home confidently.

Yesterday, I arrived to my home. Open the door. Stank very bad smell. What the hell was going here? Oh my God! All the fish was floated up on the thicken water. I assessed they had died for 3 days because of ammonia and not by automation system failure.

The catastrophic came from my prepaid home electricity. It showed 000 kwh (kilo watt hour), hence my aquarium pump and filter was turning off and couldn't cleaning up the food leftover. I miscalculated the power usage of all electricities in my home. I should bought more KWh before I left, but I didn't.

**Conclusion**

The lessons that I learned here are:

1.  Prepare the automation system with backup battery. I have a plan to create mini solar powered battery system as a backup from the main electricity.
2.  Making a simple app that can calculate the amount of needed kwh for all home appliances.
