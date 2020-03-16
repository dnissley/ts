// interfaces in typescript allow for checking the "shape" of an object
// aka "duck typing" / "structural subtyping"

const myObj = { size: 10, label: "Size 10 Object" };

// ----------------------------------------------------------------------------
// declare inline:
// ----------------------------------------------------------------------------

function printLabel1(labeledObj: { label: string }) {
  console.log(labeledObj.label);
}

printLabel1(myObj);

// compiler error:
// printLabel1({});

// ----------------------------------------------------------------------------
// declare standalone:
// ----------------------------------------------------------------------------

interface LabeledValue {
  label: string;
}

function printLabel2(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

printLabel2(myObj);

// ----------------------------------------------------------------------------
// optional properties:
// ----------------------------------------------------------------------------

interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  // unfortunately doesn't seem to mandate check before use, since this compiles fine:
  const test = config.width * 2;
  const newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

const mySquare = createSquare({ color: "black" });

// ----------------------------------------------------------------------------
// readonly properties:
// ----------------------------------------------------------------------------

interface Point {
  readonly x: number;
  readonly y: number;
}

const p1: Point = { x: 10, y: 20 };
// compiler error:
// p1.x = 99;

// ----------------------------------------------------------------------------
// ReadonlyArray<T>:
// ----------------------------------------------------------------------------

let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
// all of the below result in compiler errors:
// ro[0] = 12;
// ro.push(5);
// ro.length = 100;
// a = ro;

// ----------------------------------------------------------------------------
// excess property checking:
// ----------------------------------------------------------------------------

// compiler error, since "colour" is not expected
// const mySecondSquare = createSquare({ colour: "red", width: 100 });

// if you really want you could get around this by using type assertions
const mySecondSquare = createSquare({ colour: "red", width: 100 } as SquareConfig);

// an unexpected thing that works, but only if there is at least one shared property
// with the type, in this case "width"
const squareOptions = { colour: "red", width: 100 };
const myThirdSquare = createSquare(squareOptions);

// ----------------------------------------------------------------------------
// function typing with interfaces:
// ----------------------------------------------------------------------------

interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = (src: string, subStr: string) => (true);

// types inferred:
mySearch = (src, subStr) => (false);

// compiler error:
// mySearch = (src, subStr) => ("not a boolean")

// ----------------------------------------------------------------------------
// interfaces for indexable types:
// ----------------------------------------------------------------------------

interface StringArray {
  [index: number]: string;
}

const myArray = ["Bob", "Fred"];

// two types of supported index signatures: number and string - a single type
// can support both but the type returned by the numeric indexer must be a sub
// type of the type returned from the string indexer

interface BroadObjectType {
  [prop: string]: any;
}

const broadObj: BroadObjectType = { test1: 'asdf', test2: () => {}, test3: 6 };

// you can make indexers readonly to prevent assignment

interface ReadOnlyStringArray {
  readonly [index: number]: string;
}

const readOnlyStrArr: ReadOnlyStringArray = ['a', 'bb', 'ccc'];
// compiler error:
// readOnlyStrArr[0] = 'dddd';

// ----------------------------------------------------------------------------
// class types (aka implementing interfaces):
// ----------------------------------------------------------------------------

interface ClockInterface {
  currentTime: Date
  setTime(d: Date): void;
}

class ClockOne implements ClockInterface {
  currentTime: Date = new Date();
  setTime(date: Date) {
    this.currentTime = date;
  }
  constructor(h: number, m: number) { }
}

// a class actually has two types -- static side and instance side

// interface ClockConstructor { 
//   new (hour: number, minute: number);
// }

// compiler error:
// class ClockTwo implements ClockConstructor {
//   constructor(h: number, m: number) { }
// }

// when a class implements an interface, only the instance side of the class is checked

interface ClockConstructorTwo {
  new (hour: number, minute: number): ClockInterfaceTwo;
}

interface ClockInterfaceTwo {
  tick(): void;
}

function createClock(ctor: ClockConstructorTwo, hour: number, minute: number): ClockInterfaceTwo {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterfaceTwo {
  constructor(h: number, m: number) { }
  tick() {
    console.log("beep beep");
  }
}

class AnalogClock implements ClockInterfaceTwo {
  constructor(h: number, m: number) { }
  tick() {
    console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

// "class expressions" - allows you to define classes specifying a static type and instance type

const DigitalClockTwo: ClockConstructorTwo = class DigitalClockTwo implements ClockInterfaceTwo {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}

// extending interfaces - interfaces extending eachother

interface Shape {
  color: string;
}

interface SquareTwo extends Shape {
  sideLength: number;
}

let squareTwo = {} as SquareTwo; // remember "as" = type assertion
squareTwo.color = "blue";
squareTwo.sideLength = 10;

// extending multiple interfaces

interface PenStroke {
  penWidth: number;
}

interface SquareThree extends Shape, PenStroke {
  sideLength: number;
}

let squareThree = {} as SquareThree;
squareThree.color = "blue";
squareThree.sideLength = 10;
squareThree.penWidth = 5.0;

// hybrid types

interface Counter {
  // this means this interface is a function...
  (start: number): string;
  // ... that also has properties
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function(start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function() {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;

// interfaces extending classes

class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {
  select() {}
}

// Error: Class 'Image' incorrectly implements interface 'SelectableControl'.
//   Types have separate declarations of a private property 'state'.
// class Image implements SelectableControl {
//   private state: any;
//   select() {}
// }
