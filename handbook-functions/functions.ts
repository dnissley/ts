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
