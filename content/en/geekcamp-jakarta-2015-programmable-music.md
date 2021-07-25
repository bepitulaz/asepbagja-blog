---
title: Geekcamp Jakarta 2015. Programmable Music
date: 2015-11-04
images:
- "/blog-img/programmable-music.png"
categories:
- Programming
summary: "This is my presentation about computer generated music using Clojure and Overtone."
---

[Geekcamp Jakarta 2015](http://geekcamp.id/) is a technology and business conference organized by KMKLabs. This is my presentation about computer generated music using Clojure and Overtone. The talk is using Bahasa Indonesia, but here I try to give the English transcript.

<iframe class="vidio-embed" src="https://www.vidio.com/embed/178403-geekcamp-lambda-jakarta" width="560" height="317" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen"></iframe>

**Transcript**

[00:20] I want to talk about music. Who loves music here? I'm sure many of you loves music.

[00:27] Are there many programmers here? Because it will relates with code also.

[00:36] First, I will introduce myself. My daily job is a CTO in Froyo, it's my digital marketing agency, its office is located in Bintaro. I'm also an organizer of Lambda Jakarta, it's functional programming meetup. We are discussing about Haskell, Clojure, Scala, F#, you name it. All about functional programming.

[01:06] If you look at the bottom of the slide, you can see if actually I want to be a farmer. I have private greenhouse at my home and I'm also a seasonal bedroom musician.

[01:26] This is the usual way to play music. Oh, It is my favorite band, Dream Theater. You must be play using real instrument, such as guitar, keyboard, drum, and so on.

[01:40] But, I think it will be more interesting if we can play music using a computer. We will use the programmer's way. Our instrument will be the text editor. Is it looking weird for you? Yes, it is. With the text editor, we can generate music with various sounds.

[02:06] I'm using Clojure for the programming language. Clojure is a Lisp implementation on top of Java Virtual Machine. Before we continue this talk, anybody here knows Lisp? Ok, you know it, you know it, ah you, my downline, must be know it.

[02:26] Clojure is a slightly young Lisp implementation. Released in 2007, and created by Rich Hickey. Maybe if there's someone here who has not known it, this is the Clojure code looks like. 90% of Clojure code is like that. Just call function with argument, argument, whatever argument, and so on. 90%. The rest of 10% is knowing about symbol, keyword, string, vector, map, and atom if you need mutable. Because Clojure in default is actually immutable.

[03:26] This is the simple sample code. `defn` is a function definition, parameter is a vector,`let` for local scope variable, `if` for condition, and it return true and the else is false. How to call the function? You just call the function name and put the parameter. That's it.

[04:17] Then, for the sound engine we will use Overtone. It utilises SuperCollider engine. Maybe if any of you here is a game developer, there's a chance you have heard about it. You can use it for sound synthesizing and mimicking the real instrument.

[04:53] Let's try hello world. The hello world is slightly different.

[05:14] If you know about sound design or synthesizer, actually sound is coming from sine wave, square wave, saw wave, and triangle wave. Each of them has different timbre. Let's start from sine wave.

[05:48] _typing_

[06:30] If you notice, in sine wave function you'll see frequency, attack, sustain, and release parameter. If any of you here is play in a band, there's a chance you have seen knobs on the keyboard or synthesizer to set those parameters. Attack to set how fast the tone will reach the peak, sustain to set how long the tone, and release to set how long the tone will disappear.

[07:17] _trying the waveform one by one_

[08:37] There's also noise. Just a noise sound.

[09:03] We can combine all of it to be more interesting sound like in subtractive synthesis technique.

[09:16] Let's try the simple one. Frequency modulation synthesis. A waveform that modulated by another waveform. It is like Yamaha DX-7 synthesizer. It's a breakthrough sythesizer in 80's. Here it is.

[10:28] The second sample. We can play the sampler. So, in Overtone we can also use recorded sound to be played.

[10:57] _typing_ Like this. Kick drum, snare drum, piano, or maybe guitar loop.

[11:50] We can also play chords. But, it is insane to type line by line if you play in live situation. You won't make it.

[12:09] So the better way is creating the sequencer. Sequencer is a tool to play sound loop. Now, I'm trying to make piano and drum loop.

[12:44] Left hand.

[12:50] Then the right hand.

[13:00] Then we add the drum loop.

[13:18] It's no problem if we add a synth sound that we had created before it.

[13:34] Ah I have to finish the demo, because the time is over now. Actually, you can use Overtone for recording, composing a song, or connect it to midi device.

[14:28] At last, let's jamming on Github. So, jamming is not only in music studio, we can music jamming also in Github.

**Slide and Sample Code**

The slide is using English. You can read on [Slideshare](http://www.slideshare.net/AsepBagja/geekcamp-id-2015-programmable-music).

You can also see the sample source code on [Github](https://github.com/bepitulaz/programmable-music).
