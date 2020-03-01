// boolean

const yes: boolean = true;
const no: boolean = !yes;

// number - does not differentiate between integers/decimals

const x1: number = 123;
const x2: number = 123.456;
const x3: number = 0x11; // 17
const x4: number = 0b11; // 3
const x5: number = 0o11; // 9

// string

const str: string = "hello";

// array - two ways to write, requires type parameter

const arr1: number[] = [1, 2, 3];
const arr2: Array<number> = arr1;

// tuple - collection of related values - simple sugar for fixed-size,
//         mixed-type arrays

const tupe: [number, string] = [1, "hello"];
const tupeString: string = tupe[1];

// enum - set of related constants - complicated sugar that configures 
//        inheritance between read-only singleton integer values - does
//        not require an ending semi-colon after declaration

enum Color {Red, Green, Blue} // Red = 0, Green = 1, Blue = 2
const redValue: Color = Color.Red;
const redNameOfValue: string = Color[redValue]; // = 'Red'

enum Speed {Slow = 1, Medium, Fast = 33} // Medium = 2

// any - used to state that we don't know the type of a value - 
//       essentially opts out of type checking for this variable

let notSure: any = {};
notSure = 55; // not a type violation
notSure = "asdf"; // not a type violation
notSure = () => { console.log("hi"); }; // not a type violation

// void - usually used to indicate a function does not return a value
//        - can only assign null to variables of this type

const pointless: void = null;

function noReturn(): void {
  console.log('hi');
}

// null + undefined - similar to void, just used to capture the fact
//                    that these values exist in js and are distinct
//                    from other values

const alsoPointless: null = null
const alsoAlsoPointless: undefined = undefined

// never - represents the type of values that never occur - examples
//         being a function that always throws an exception or a
//         function that never returns (runs forever)

function throwsAnError(): never {
  throw new Error("bye");
}

function runsForever(): never {
  while (true) {
    console.log("loop");
  }
}

// object - represents the "non-primitive type" - anything that's not
//          a number, string, boolean, symbol, null, or undefined

const o: object = { someProperty: 123 }

