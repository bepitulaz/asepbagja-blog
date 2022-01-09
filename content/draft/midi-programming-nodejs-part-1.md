---
title: "MIDI Programming With Node.js - Part 1" 
date: 2022-01-08
categories:
- Programming
images:
- "/blog-img/node-rust.jpg"
summary: "We can use Node.js to control our favourite Digital Audio Workstation software."
lang: "English"
---

MIDI (Musical Instrument Digital Interface) is a protocol that allows computer, musical instruments, and other hardwares to communicate. It was developed in the early 80s because manufacturers need a way to make their products compatible with other products from other manufacturers. For example, I have a keyboard from Korg brand, and I want to connect it with an expression pedal from Behringer brand, I can just connect them together by using MIDI cable through their MIDI in/out port.

In the modern time that computer is a common tool for music production, MIDI data can be transferred via USB cable and USB port. Most of modern electronic musical instrument have built-in USB port along with traditional MIDI in/out port. This is the example from the back panel of my Korg Kross 2 workstation keyboard.

**What is MIDI controller?**

A MIDI controller is any hardwares or softwares that generates and transmits MIDI data to MIDI-enabled devices. The common MIDI controller in the market is hardware in the form of keyboard (piano like), knobs, faders, or grid pads. A MIDI controller doesn't produce it own sound, because it's usually to trigger and control sound from other musical hardwares or computer softwares.

Nowadays, there are many MIDI controllers in the form of software. You can search it on Apple App Store and Google Play Store with "midi controller" keyword.

**Digital Audio Workstation**
