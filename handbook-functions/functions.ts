// ----------------------------------------------------------------------------
// adding types to functions -- covered in the handbook-basic-types example:
// ----------------------------------------------------------------------------

function add(x: number, y: number): number {
  return x + y;
}

// ----------------------------------------------------------------------------
// function return type inference:
// ----------------------------------------------------------------------------

// return type of add1 is inferred to be number
function add1(x: number, y: number) {
  return x + y;
}

// ----------------------------------------------------------------------------
// type of a function variable:
// ----------------------------------------------------------------------------

const add2: (a: number, b: number) => number = add;

// ----------------------------------------------------------------------------
// type inference from left-to-right:
// ----------------------------------------------------------------------------

// types of x, y, and the return value are inferred to be numbers
const add3: (a: number, b: number) => number = function (x, y) {
  return x + y;
};

// ----------------------------------------------------------------------------
// type inference from right-to-left:
// ----------------------------------------------------------------------------

// type of add4 is inferred to be `(x: number, y: number) => number`
const add4 = function (x: number, y: number): number {
  return x + y;
};

// ----------------------------------------------------------------------------
// function calls are type checked for # of params, unlike vanilla js:
// ----------------------------------------------------------------------------

function buildName(firstName: string, lastName: string) {
  return firstName + " " + lastName;
}

// const result1 = buildName("Bob") // error: not enough params
// const result2 = buildName("Bob", "Adams", "Sr.") // error: too many params
const result3 = buildName("Bob", "Adams");

// ----------------------------------------------------------------------------
// optional params:
// ----------------------------------------------------------------------------

// by default parameters are required, adding a question mark makes them optional
function buildName1(firstName: string, lastName?: string) {
  if (lastName) return firstName + " " + lastName;
  else return firstName;
}

const result4 = buildName1("Bob"); // works now
// const result5 = buildName1("Bob", "Adams", "Sr.") // error: too many params
const result6 = buildName1("Bob", "Adams");

// ----------------------------------------------------------------------------
// default params:
// ----------------------------------------------------------------------------

// lastName is implicitly optional -- no need to add the question mark
// lastName's type is inferred to be string -- no need to add a type to it
function buildName2(firstName: string, lastName = "Smith") {
  if (lastName) return firstName + " " + lastName;
  else return firstName;
}

const result7 = buildName2("Bob"); // works still
const result8 = buildName2("Bob", undefined); // also works
// const result9 = buildName2("Bob", "Adams", "Sr.") // error: too many params
const result10 = buildName2("Bob", "Adams");

// ----------------------------------------------------------------------------
// rest parameters:
// ----------------------------------------------------------------------------

// all params given but the first will be collected into the restOfName parameter
function buildName3(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

// returns "Joseph Samuel Lucas MacKinzie"
const employeeName = buildName3("Joseph", "Samuel", "Lucas", "MacKinzie");

// the rest "ellipsis" is part of the function type
const buildName4: (f: string, ...r: string[]) => string = buildName3;

// ----------------------------------------------------------------------------
// this and non-arrow functions:
// ----------------------------------------------------------------------------

const brokenDeck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function () {
    return function () {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return {
        // Q: what is `this` referring to?
        // A: it depends on where this function is invoked
        // if "within" `brokenDeck` then `this.suits` will refer
        //   to `brokenDeck.suits`
        // if "outside" `brokenDeck` then `this.suits` will refer
        //   to `<global>.suits`
        suit: this.suits[pickedSuit],
        card: pickedCard % 13,
      };
    };
  },
};

const cardPicker = brokenDeck.createCardPicker();
try {
  cardPicker();
} catch (e) {
  // error: cannot read property '1' of undefined
  console.error(e);
}

// in a non-arrow function, this changes based on where the function is invoked
// so if a non-arrow function is returned from one context and invoked from
// outside that context, it may not have access to the same data

// ----------------------------------------------------------------------------
// this and arrow functions:
// ----------------------------------------------------------------------------

const fixedDeck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function () {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      // Q: what is `this` referring to now?
      // A: since this is a non-arrow function, `this` is "fixed" to the
      //      context in which the function is defined, so that no matter
      //      where it is invoked, it always is referring to the same thing
      return {
        suit: this.suits[pickedSuit],
        card: pickedCard % 13,
      };
    };
  },
};

const cardPicker1 = fixedDeck.createCardPicker();
const pickedCard1 = cardPicker1();

console.log("card: " + pickedCard1.card + " of " + pickedCard1.suit);

// unfortunately, `this.suits` is still implicitly `any`

// the next section shows how to fix this using a this parameter

// ----------------------------------------------------------------------------
// this parameters:
// ----------------------------------------------------------------------------

interface Card {
  suit: string;
  card: number;
}

interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}

const fixedDeck1: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  // the function now explicitly specifies that its callee must be of type Deck
  // meaning if you tried to invoke this function
  createCardPicker: function (this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return {
        suit: this.suits[pickedSuit],
        card: pickedCard % 13,
      };
    };
  },
};

// works as before:
const cardPicker2 = fixedDeck1.createCardPicker();
const pickedCard2 = cardPicker2();

// does not work since the function is not invoked from a deck object:
const cardPickerCreator = fixedDeck1.createCardPicker;
// below error: the 'this' context of type 'void' is not assignable to method's 'this' of type 'Deck'
// const cardPicker3 = cardPickerCreator();

// this parameters must be first in a parameter list, and can't be included
// on arrow functions

// ----------------------------------------------------------------------------
// specifying that a callback doesn't rely on this:
// ----------------------------------------------------------------------------

interface UIElement {
  // notice the use of `this: void` -- this specifies that a callback either should
  //   be an arrow function, or a non-arrow function that doesn't reference `this`
  addClickListener(onclick: (this: void, e: Event) => void): void;
}
const uiElement: UIElement = {
  addClickListener(onClick) {
    console.log("called addClickListener");
  },
};

class Handler {
  info: string;
  onClickBad(this: Handler, e: Event) {
    // oops, used `this` here. using this callback would crash at runtime
    this.info = `is it cancelable? ${e.cancelable ? "yes" : "no"}`;
  }
}
let h = new Handler();
// uiElement.addClickListener(h.onClickBad); // error:
// Argument of type '(this: Handler, e: Event) => void' is not assignable to parameter of type '(this: void, e: Event) => void'.

// ----------------------------------------------------------------------------
// function overloads / overloading:
// ----------------------------------------------------------------------------

const suits = ["hearts", "spades", "clubs", "diamonds"];

// overloads happening here:
function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x: any): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

const myDeck = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 },
];

const pickedCard3 = myDeck[pickCard(myDeck)];
console.log("card: " + pickedCard3.card + " of " + pickedCard3.suit);

let pickedCard4 = pickCard(15);
console.log("card: " + pickedCard4.card + " of " + pickedCard4.suit);
