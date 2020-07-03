// ----------------------------------------------------------------------------
// adding types to functions -- covered in the handbook-basic-types example
// ----------------------------------------------------------------------------

function add(x: number, y: number): number {
  return x + y;
}

// ----------------------------------------------------------------------------
// type of a function variable:
// ----------------------------------------------------------------------------

let add1: (a: number, b: number) => number = add;

// ----------------------------------------------------------------------------
// type inference from left-to-right:
// ----------------------------------------------------------------------------

let add2: (a: number, b: number) => number = function (x, y) {
  return x + y;
};

// ----------------------------------------------------------------------------
// type inference from right-to-left:
// ----------------------------------------------------------------------------

// type of add3 is `(x: number, y: number) => number`
let add3 = function (x: number, y: number): number {
  return x + y;
};
