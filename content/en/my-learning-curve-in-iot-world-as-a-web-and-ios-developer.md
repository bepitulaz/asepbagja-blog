---
title: My Learning Curve In IoT World As A Web and iOS Developer
date: 2015-03-16
categories:
- Programming
images:
- "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
---

As a web developer and iOS developer, I didn't know much about hardware or bare metal programming. I only learned about resistor, capasitor, transistor, etc when I was still in junior high school, thus my electronic knowledge is very limited.

**Arduino Uno R3. My First Board.**

I was interested for learning electronic again as a hobby around 2-3 years ago, when I read that Arduino is easy for learning micro controller programming. I bought it for IDR190.000 (around USD15). I also ordered a bread board for prototyping, some jumper cables, and a pair of LEDs.

I must admit that it was not easy enough for the first time. I had to learn Arduino IDE with Processing language, and learned some jargons that I never knew before in web programming e.g., baud rate, digital pin, analog pin, Tx/Rx, serial port, etc. Finally, I can made my first project run. It was blinking the LED project. Arduino IDE makes everything simple, from writing the code (sketch) until uploading it to the board.

Today, learning Arduino programming from web development background is getting easier. We can do it by using JavaScript with NodeJS and Johnny-Five package.

**Raspberry Pi. Small Linux Board with ARM Processor.**

After doing some small toy projects in Arduino platform, I read about Raspberry Pi the $35 credit card size computer. The first time I knew about GPIO (General Purpose Input/Output) was from this board, and with this board also I learned how to build a cross compiler toolchain for compiling C program from OSX to RPi. I was using this board for various purposes, mostly for home entertainment.

My latest hobby project was building the automation system for my aquarium. It utilized RPi to control servo motor for rotating the fish food dispenser over the internet. I built it by using NodeJS, SocketIO, and [Johnny-Five](https://www.npmjs.com/package/johnny-five) package.

<iframe src="https://www.youtube.com/embed/oNoDhwC3RDk" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>

The problem came when I want to deploy it on my aquarium. I felt $35 was not worth to be placed as a permanent installation, because I still need the RPi for my home entertainment. So, I should find the cheap way. Arduino obviously not the cheap way. It is $15, but if I want to connect it to the internet I should buy either ethernet shield or the expensive wifi shield.

My friend gave me a solution via Twitter. He mentioned about...

**ESP8266. The $5 Wifi Module.**

I google-ed it. It is a new wifi module that people usually use it as a module for Arduino, but actually it can be used as a stand alone micro controller. So, I ordered it for IDR70.000, also with USB TTY programmer for IDR22000. The total shopping was just IDR99.000 (around $7). It is worth to solder permanently.

![esp-8266](https://s3-ap-southeast-1.amazonaws.com/asepco/wp-content/uploads/2016/03/25200525/esp-8266.jpg)

The USB TTY is used to program the micro controller. ESP8266 has 2 GPIO pins and working with 3.3 volt power. I can't use JavaScript for this hardware, thus it becomes my first time for writing my own firmware in C and deploy (flash) it to a hardware that don't have operating system. Now, I'm in progress for porting my aquarium system to use this coin size and cheap module.

I will write the tutorial about how to use it in the next post.
