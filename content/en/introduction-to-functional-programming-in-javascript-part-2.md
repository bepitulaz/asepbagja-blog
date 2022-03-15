---
title: Introduction to Functional Programming in JavaScript (Part 2)
date: 2016-07-04
categories:
- Programming
images:
- "/blog-img/js-img.jpg"
summary: "JavaScript has the first-class function. It means the functions in JavaScript treats as a value."
---

In [part 1](https://www.asepbagja.com/programming/introduction-to-functional-programming-in-javascript-part-1/), we had learned about two important concepts in functional programming paradigm: immutable data and pure function. Now, we will learn another important concept in functional programming, that is higher order function.

According to Wikipedia, higher-order function is a function that does at least one of the following:

*   takes one or more functions as arguments
*   returns a function as its results.

JavaScript has the first-class function. It means the functions in JavaScript treats as a value, that we can assign it to the variable, pass it around, and return from another function. Therefore, JavaScript supports higher order function. I'm sure every JavaScript programmer ever used higher order function in their life. If you ever used jQuery, you must be familiar with these syntaxes:

```javascript
$.get("my-api-url.com", function(res) {
  console.log(res);
});

// or

$("#my-awesome-button").click(function(evt) {
  evt.preventDefault();
});
```

Those are the sample implementations. We passed the function as an argument to another function.

**Map, Filter, and Reduce**

`Map`, `filter`, and `reduce` are three methods those are natively available in most browsers and in NodeJS. We will intensively use these methods when doing functional programming in JavaScript and also in any programming language.

`Map` takes a function and collection of items, runs the function on each item in the collection, and returns a new collection as the result. This is the simple example of `map`.

```javascript
let sample = [1, 2, 3]; // I want add each item by 1

// we pass an anonymous function to the map
let mapResult = sample.map((item) => {
  return item + 1;
});

console.log(mapResult); // [2, 3, 4]
console.log(sample); // the original data does not change: [1, 2, 3]
```

So, actually, we did not need to implement it by our self like we did in part 1 of this article -- the `pureFunction` section.

Next is `filter`. It takes a function and a collection, runs the function on each item in the collection, returns a new collection when the function returns `true`. This is the simple example of `filter`.

```javascript
let sample = [1, 2, 3]; // I want the even number only

let filterResult = sample.filter((item) => {
  return item % 2 === 0;
});

console.log(filterResult); // [2]
console.log(sample); // the original data does not change: [1, 2, 3]
```

The later is `reduce`. It takes a function and a collection of items,and returns the value by combining the items. This is the simple example of `reduce`.

```javascript
let sample = [1, 2, 3]; // I want to sum all the items

let reduceResult = sample.reduce((prev, current) => {
  return prev + current;
});

console.log(reduceResult); // 6
console.log(sample); // the original data does not change: [1, 2, 3]
```

The advantage of using `map`, `filter`, and `reduce` is you can easily chain all those function with predictable behaviour. This is the sample case to use it all together.

```javascript
let leads = [{
  name: "Acme Company",
  isDeal: true,
  currency: "USD",
  deal: 150
}, {
  name: "Seven Eleven",
  isDeal: false,
  currency: "IDR",
  deal: 1000000
}, {
  name: "Cozyfield",
  isDeal: false,
  currency: "IDR",
  deal: 2500000
}, {
  name: "Froyo Agency",
  isDeal: false,
  currency: "USD",
  deal: 2000
}];

// get all data with USD, change the currency symbol to $
let getUsdOnlyWithDollar = leads.filter((item) => {
  return item.currency === "USD";
}).map((item) => {
  return {
    name: item.name,
    isDeal: item.isDeal,
    currency: "$",
    deal: item.deal
  };
});

// [{ name: 'Acme Company', isDeal: true, currency: '$', deal: 150 },
// { name: 'Froyo Agency', isDeal: false, currency: '$', deal: 2000 } ]
console.log(getUsdOnlyWithDollar);

// get all data with isDeal is false, convert all USD currency to IDR
// 1 USD = IDR 13000, then sum all the amount of expected deal
let calculateIt = leads.filter((item) => {
  return !item.isDeal;
}).map((item) => {
  let result = {
    name: item.name,
    isDeal: item.isDeal,
    currency: item.currency
  };

  if(item.currency === "USD") {
    result.deal = item.deal * 13000;
  } else {
    result.deal = item.deal;
  }

  return result;
}).reduce((prevItem, currItem, index, array) => {
  return {deal: prevItem.deal + currItem.deal};
});

console.log(calculateIt); // { deal: 29500000 }
```

**Currying**

We won't cook that spicy and exotic cuisine for now. Currying is the process of transforming a function that takes multiple arguments into a function that takes only a single argument and returns another function if the arguments are still needed. Take a look at these two code snippets:

```javascript
let greeting = (message, name) => {
  return message + " " + name;
};

console.log(greeting("Hello", "Asep")); // "Hello Asep"
console.log(greeting("Hello", "Bagja")); // "Hello Bagja"
```

We already familiar with that syntax, nothing wrong with that. Now the curried version for that greeting function.

```javascript
let curriedGreeting = (message) => {
  return (name) => {
    return message + " " + name;
  }
}

let sayHello = curriedGreeting("Hello"); // this is partially applied function
console.log(sayHello); // it returns a function
console.log(sayHello("Asep")); // "Hello Asep"
console.log(sayHello("Bagja")); // "Hello Bagja"

// you can also call it directly by using another parentheses
curriedGreeting("Hello")("Asep"); // "Hello Asep"
curriedGreeting("Hello")("Bagja"); // "Hello Bagja"
```

At the moment we invoke `curriedGreeting` with only one argument, it will return the next function that still waiting to be invoked by the second argument. After the second argument is passed to the function, we will get our expected return value.

That looks so cool, but why we want to do that? It's not straightforward, is it? Ok, let me show you a use case that can be considered to use this technique.

```javascript
let callAPI = () => {
  // Do the web service call here. Let's assume it returns an array of objects
  return [{
    name: "Brio",
    manufacturer: "Honda"
  },
  {
    name: "Avanza",
    manufacturer: "Toyota"
  },
  {
    name: "Innova",
    manufacturer: "Toyota"
  }];
};

// Filter the data with curried function
let filterData = (fn) => {
  return (manufacturer) => {
    return fn.filter((item) => {
      return item.manufacturer === manufacturer;
    });
  }
}

// call the web service only one time
let filterBy = filterData(callAPI());

// then we can use the result multiple times
console.log(filterBy("Toyota"));
console.log(filterBy("Honda"));
```

Currying is a useful technique in functional programming. It can avoid repetition in our code, thus makes the code more efficient. I encourage you to play and use it in your JavaScript code.

**Summary and What's Next?**

JavaScript supports higher-order function very well. It makes JavaScript suitable to apply some techniques from functional programming paradigm, and we can combine it with the knowledge that we had learned from the [part 1](http://asepbagja.com/programming/introduction-to-functional-programming-in-javascript-part-1/) of the article to make our code more brevity.

Learning functional programming won't hurt you. I encourage you to learn a programming language that specifically designed for it because many techniques and concepts are hard to explain or do in JavaScript. You can pick Haskell, Clojure, Scala, Elixir, OCaml, etc. By knowing imperative programming and functional programming you will get the best of both worlds.

Hope you enjoy this series of introduction to functional programming.
