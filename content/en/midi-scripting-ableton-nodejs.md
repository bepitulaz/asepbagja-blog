---
title: "MIDI scripting Ableton Live with Node.js" 
date: 2022-01-16
categories:
- Programming
images:
- "/blog-img/ableton-human-migration.png"
summary: "How to control and automate a DAW such as Ableton Live with Node.js."
lang: "English"
featured: false
---

Recently, I released my debut single [A New Life](https://www.asepbagja.com/music/a-new-life-singles). It's a [generative music](https://en.wikipedia.org/wiki/Generative_music) album that I composed and programmed using JavaScript. In this article, I will share the process behind it. But, before going to the code, let me explain some music technology terms that I use a lot.

![A New Life](/music-img/a-new-life.jpg)

**MIDI**

[MIDI (Musical Instrument Digital Interface)](https://midi.org) is a protocol that allows computers, musical instruments, and other hardware to communicate. It was developed in the early 80s because manufacturers need to make their products compatible with other products from other manufacturers. For example, I can connect a keyboard from the Korg brand to an expression pedal from Behringer using a standard MIDI cable.

In modern times, when a computer is a go-to tool for music production, MIDI data is transferred via USB cable and USB port. Most modern electronic musical instruments have a built-in USB port along with traditional MIDI in/out port. The picture below is the example from the back panel of my Korg Kross 2 workstation keyboard.

![Korg Kross 2 back panel](/blog-img/korg-kross-back-panel.jpg)

**What is a MIDI controller?**

A MIDI controller is any hardware or software that generates and transmits MIDI data to MIDI-enabled devices. The most-selling MIDI controller in the market is hardware in the form of a keyboard (piano like), knobs, faders, or grid pads. A MIDI controller doesn't produce sound. People use it to trigger and control sound from other musical hardware or computer software.

In the age of mobile computing, there are many MIDI controllers in software/app form. You can search it on Apple App Store and Google Play Store with a "midi controller" keyword.

**Digital Audio Workstation**

Digital Audio Workstation is an electronic device (hardware) or computer software to record, edit, and produce audio files. Nowadays, most musicians and music producers use the software DAW because the personal computer has more and more computing power. Some of the popular DAWs in the market are [Logic Pro](https://apple.com/logic-pro/), [Pro Tools](https://www.avid.com/pro-tools), [Cubase](https://www.steinberg.net/cubase/), and [Ableton Live](https://ableton.com).

#### Let's dive into the process!

The concept here is simple. I use Node.js scripts as a MIDI controller to control my hardware synthesiser through DAW. I used Ableton Live 11 Lite for A New Life single, but it is applicable for any DAW. Here is the connectivity schema.

![DAW - Node.js schema](/blog-img/daw-connection.PNG)

I can use Node.js scripts to directly control the synthesiser and let DAW record only the audio. But, I didn't go that route. The reason for that is I want DAW to save any MIDI data that come from the script. As you may already know, the Tallinn in December song is a piece of generative music that the note came from real-time weather forecast data. If something happens with my master record, it will not be possible to recreate that song again later with the same note.

First, I define the script as a virtual instrument using the [`easymidi`](https://github.com/dinchak/node-easymidi) library.

```
const easymidi = require("easymidi");

const virtualInput = new easymidi.Input("Node.js input", true);
const virtualOutput = new easymidi.Output("Node.js output", true);
```

Only with three lines of code, the script can be visible as a MIDI device in DAW's MIDI track.

![Node.js virtual instrument](/blog-img/daw-node-script.png)

**Sync Node.js with the sequencer in Ableton**

MIDI can sync the tempo between multiple devices. Imagine I have two musical instruments: a synthesiser that plays an arp (a melody that can play automatically) and a drum machine. I can sync both devices by selecting one as a master, and other devices will follow the tempo of the master. In my case, the master is Ableton. Node.js script and my Korg Kross 2 synthesiser must follow the master tempo of DAW. I don't need to worry about my synthesiser. It has a built-in MIDI sync feature because the manufacturer follows the MIDI specification.

How about the Node.js script? I have to program it and follow the MIDI specification too. The program must track the MIDI clock from the master. A MIDI clock is a signal broadcasted from the master via MIDI protocol to sync devices and software. According to MIDI specification, there are 24 pulses per [quarter note](https://en.wikipedia.org/wiki/Quarter_note).

```
const MIDI_CLOCK_PER_QUARTER_NOTE = 24; // From MIDI specification:
const MASTER_TEMPO = 40; // BPM = number of quarter notes per minute
```

I defined the value of the clock per quarter note and the master tempo. The tempo measurement unit is BPM (Beat Per Minute). From that information, I can calculate how many MIDI clocks per minute for 40 BPM tempo.

```
let totalClockPerMinute = MIDI_CLOCK_PER_QUARTER_NOTE * MASTER_TEMPO;
```

Now, here's the main code. I did the MIDI clock counting inside an event loop. The `easymidi` library has a callback event, and it can be triggered when a MIDI clock comes from the master.

```
let clockCounting = 1;
virtualInput.on("clock", () => {
  if (clockCounting === totalClockPerMinute) {
    // Reset the counter
    clockCounting = 1;
  }
  
  // Do everything creative inside this block
  // Example: send the note data per quarter, sixteenth, half, eight, or whole note.
  // ...this area is our canvas...
  
  // Example:
  // Sending a note every half note
  if (clockCounting %  (MIDI_CLOCK_PER_QUARTER_NOTE * 2) === 1) {
    virtualOutput.send("noteon", {
      note: 55,
      velocity: 130,
      channel: 1,
    });   
  }

  clockCounting++;
});
```

**Wrap up**

The code above is the skeleton to compose the music and sync Node.js scripts with the sequencer in DAW. Now, you can read and play with the complete source code in [A New Life's Github repository](https://github.com/bepitulaz/generative-music).

Please, check the [MIDI specification](https://midi.org/specifications) for the additional resource.