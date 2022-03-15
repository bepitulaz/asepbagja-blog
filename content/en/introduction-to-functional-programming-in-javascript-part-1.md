---
title: Introduction to Functional Programming in JavaScript (Part 1)
date: 2016-07-03
categories:
- Programming
images:
- "/blog-img/js-img.jpg"
summary: "Functional programming paradigm concentrates on computing results rather than performing actions."
---

Imperative programming is a programming paradigm that uses a sequence of statements to reach a certain goal. It focuses on how to perform actions to achieve the expected result. Otherwise, functional programming paradigm concentrates on computing results rather than performing actions. In another word, the imperative one is an annoying micromanager in your office, and the functional one is a macromanager who just describe what's the job to be done.

Imagine this situation. You are asked by your boss to get 3 sales leads by the end of the week. The approach will be distinctive by those 2 paradigms.

The imperative boss will micromanage you by telling you something like these:

1.  Open Craigslist
2.  Find the phone number
3.  If you find it, please dial that number
4.  Tell to the prospective client, "Hello, I'm from annoying company...bla...bla..."
5.  If you can't find the phone number, you should seek the email address
6.  Send them an email with this sentence, "Hello, I'm from annoying company...bla...bla..."
7.  When you can't find the contact in Craiglist, you should try open Yellow Pages
8.  Schedule a meeting at Wednesday afternoon with the prospective client
9.  ...and so on, until you get 3 sales leads by the end of the week.

The functional boss will tell something more descriptive without micromanaging you:

1.  That is a computer with internet connection on the desk, you can use it to find and contact some leads
2.  You can use office phone to call them
3.  Schedule a meeting whenever you feel it is necessary
4.  Return back to me after you get 3 sales leads by the end of the week.

After we get distinctive between those 2 paradigms, now we will try to implement it in JavaScript. JavaScript currently is one of the hottest and mainstream programming languages which support multi-paradigms. So, we can use it to program in a functional way, while using the imperative features whenever necessary.

**The first pillar of FP: think about immutable data**

Immutable data means the data can't be modified after its creation to avoid side effects. JavaScript does not force us to use immutable data like any other programming language specifically designed for functional programming, therefore we should force our self to think about immutability when programming with the functional paradigm. Consider this mutable code:

```javascript
// 1: simple mutable data sample
let x = 10; // create the initial value
x = x + 1;
console.log(x); // now x's value is 11

// 2: the mutable loop
let sample = [1, 5, 3, 2];
for(let i = 0; i < sample.length; i++) { // the i's value is changing on each iteration
  sample[i] = sample[i] + 1;
}
console.log(sample); // now sample's value is [2, 6, 4, 3]
```

It's hard to spot the bugs in a large code base with many mutable data. Do you remember the micromanaging boss? Yes, it's kinda like that. According to sample number 2 above, we will read the loop 4 times to track the current value of `sample`. Imagine if you have an array with 1000 elements inside it. Have fun with that.

**The second pillar of FP: Pure Function**

A pure function is a function that does not depend on and modifies the states of the variable out of its scope. It means the function always returns the result given same parameters and produces no side effects. I will give you an example to understand about "side effect".

```javascript
let sample = [1, 2, 3]; // I want each element of this array add by 1.

function impureFunction(data) {
  for(let i=0; i < data.length; i++) {
    data[i] = data[i] + 1;
  }
  return data;
}

let result = impureFunction(sample);
console.log(result); // You get what you want: [2, 3, 4]
console.log(sample); // But you get the side effect too. The value has been changed :(
```

You can think the side effect in code is the same as the side effect in medicine. When you drink cough syrup, your cough maybe stops, but after that, you will feel sleepy. In a large code base, the impure function will hard to test and debug. So, we will rewrite that by using pure function and immutable data.

```javascript
let sample = [1, 2, 3];

function pureFunction(data, index, init) {
  if(index < data.length) {
    let current = [data[index] + 1];
    let result = init.concat(current);
    return pureFunction(data, index + 1, result); // we use recursion instead of for loop
  } else {
    return init;
  }
}

let result = pureFunction(sample, 0, []);
console.log(result); // you get what you want: [2, 3, 4]
console.log(sample); // your original data does not mutate: [1, 2, 3]
```

According to the code above, we are making a new array instead of mutating the original one. We also use recursion to avoid side effect. Let's scrutinize the `pureFunction` function to understand it.

```javascript
// pureFunction takes 3 parameters: data, index, init
// pureFunction will create a new array as a return value
pureFunction(data, index, init) {
  return init;
}

// The type signature of pureFunction actually like this
// I'm using Haskell type signature syntax, since JavaScript is dynamic typing
pureFunction :: [Int] -> Int -> [Int] -> [Int]

// data is for our original array
// index is for the index of the array
// result is our copy of original array
// so if we call the function, the operation actually like this
pureFunction([1, 2, 3], 0, []);

pureFunction(data, index, init) {
  let current = [data[0] + 1];
  let result = init.concat(current);
  return result; // it is [2]
}

pureFunction([1, 2, 3], 1, [2]);

pureFunction(data, index, init) {
  let current = [data[1] + 1];
  let result = init.concat(current);
  return result; // it is [2, 3]
}

// and so on
```

That is the explanation of pure function. What you give is what you get. It does not depend on to any variable outside its scope. So, we can test and debug the function easier.

**Summary**

In this first part, we had changed our way of thinking to express our idea to achieve the result. We have learned about immutable data and pure function to avoid side effect and made our code more concise. Those are still basic things before we dive deeper to learn about functional programming in JavaScript (or in another language). Hope you enjoy it and see you in the next part.

P.S. [The second part](https://www.asepbagja.com/programming/introduction-to-functional-programming-in-javascript-part-2/) of this article has been published.
