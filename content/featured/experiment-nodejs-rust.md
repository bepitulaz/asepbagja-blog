---
title: "Experiment: Boost Node.js App Performance With Rust" 
date: 2021-08-17
categories:
- Programming
images:
- "/blog-img/node-rust.jpg"
summary: "My experiment to make the Node.js app fast with WebAssembly and Node native module that written in Rust."
lang: "English"
---

Recently, I'm planning to build a weekend project for personal purposes. It's an application to analyse stock market data for helping me in my investment journey. I plan to use Node.js as the backend. However, I'm curious about how Node.js perform when handling a large dataset. How fast can it do the operation?

To answer that question, I created this scenario:
1. Create an array with 5 million elements with a float data type. It is to simulate the stock price dataset.
2. Calculate the [Simple Moving Average](https://www.investopedia.com/terms/s/sma.asp) for a specific window interval from that dataset. It is the operation that I want to measure.

Here is how I generated the 5 million elements of an array. We won't measure this operation.

```
const simulateClosingPrices = Array.from({length: 5000000}, () => Math.random() * 5000);
```

Below is the code to calculate SMA in JavaScript. I packaged it as a Node module.

<script src="https://gist.github.com/bepitulaz/5fc2b4a2a42b5225e2ea47b098a12883.js"></script>

Here is the execution time.

```
elapsed time:   160.32ms
elapsed user:   124.93ms
elapsed system: 28.68ms
```

#### Can we make it faster?

Hmm...how if I involve [Rust](http://rust-lang.org)? I love that language. It's a system programming language that doesn't have a garbage collector and compile into native code. In theory, it will be faster than JavaScript. To embed and use Rust with Node.js, I have to package it as a Node module. There are two options to do that. First, compile it as a Node native module. The second one, target it for [WebAssembly](https://webassembly.org) and package it as a Node module.

Let's try both options. These are the toolchain to make the Node module with Rust:
- [wasm-pack](https://rustwasm.github.io/wasm-pack/): It's a toolchain to compile Rust code into WebAssembly.
- [node-bindgen](https://github.com/infinyon/node-bindgen): It's a toolchain to compile Rust code into a native module.
- [neon-bindings](http://neon-bindings.com): This one can compile Rust code into a native module too. But, after I tried it, I couldn't reuse my existing Rust code for WebAssembly. I must adjust many parts of it. So, I abandon it.

Below is the code to calculate SMA in Rust and targeting WebAssembly.

<script src="https://gist.github.com/bepitulaz/88eb126ef1dd2ccd80d890aeee0c77a5.js"></script>

Below is the code to calculate SMA in Rust and targeting the native module. In my case, it will compile to `aarch64-apple-darwin` instruction since I ran this benchmark on the Apple M1 processor.

<script src="https://gist.github.com/bepitulaz/870868b5fe5fed87d21911d415a85891.js"></script>

### The result

```
First run
|                           | JS     | WASM  | Native Module |
|---------------------------|--------|-------|---------------|
| elapsed total time in ms  | 160.32 | 81.89 | 1137.70       |
| elapsed user time in ms   | 124.93 | 53.81 | 1106.9        |
| elapsed system time in ms | 28.68  | 22.25 | 74.05         |

Second run
|                           | JS     | WASM  | Native Module |
|---------------------------|--------|-------|---------------|
| elapsed total time in ms  | 144.09 | 75.94 | 1165.27       |
| elapsed user time in ms   | 123.32 | 52.72 | 1109.09       |
| elapsed system time in ms | 22.53  | 23.26 | 84.15         |
```

It is surprised me. My expectation was the native module will perform faster than WebAssembly, but the result was the opposite.  Probably, it happened because I tried to map the JS array directly into the Rust vector. I read some articles it said would be better if I passed the [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) instead of JS array. Let's try it in the next article.

According to this experiment, WebAssembly performs 2x faster for the total time than pure JavaScript when handling this scenario.

_The featured image photo by <a href="https://unsplash.com/@chrisliverani?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chris Liverani</a> on <a href="https://unsplash.com/s/photos/speed?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>_
  