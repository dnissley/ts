// assertions - two forms

// type 1: "angle-bracket" form
const someValue: any = "this is a string"
const someLength: number = (<string>someValue).length

// type 2: "as" form
const anotherValue: any = "this is a string"
const anotherLength: number = (anotherValue as string).length

