## Comments
```
// End of line comment
/* Block comment */
```

## Variable
var is mutable while val is immutable

```
var name
val name
```

## Number

```
val name = 0
```

## String
String interpolation is done like this "${token}"

```
val name = ''
val name = ""

var name = "${name}"
var name = '${name}'
```

## Array
Can omit brackets

```
val name = [item1, item2, ..., itemN]
val name = item1, item2, ..., itemN
```

## Object
Can omit braces (not when empty) and commas

```
val name = {}
val name = { name: value }
val name = { n1: v1, n2: v2 }

var test = 3

val name = { test hi: 'hi there' }
```
## Function
Can omit the return if expression is at the of the block

Declaration modifiers:

| Mod |   Showcase    |                           Description                           |
|:----|:--------------|:----------------------------------------------------------------|
| none| (... ->  ...) | A regular function                                              |
| =   | (... =>  ...) | Gets the parents scope                                          |
| *   | (... *-> ...) | Makes it a generator function                                   |
| :   | (... :-> ...) | Does not return if expression                                   |
| :=  | (... :=> ...) | Gets the parents scope and does not return if it is a expression|

Parameters:

1. Can be named (can not be used by javascript)
2. Can have default value
3. Can have the same value as another parameter by using a colon before parameter name
4. Can omit parentheses around parameters
 
#### Examples
```

add x y -> x + y
run fun :-> fun()

```
In js 
```js
function add(x, y) {
    return x + y
}
function run(fun) {
    fun()
}
```

## For

Can omit parentheses. Must then end with colon or then

for (token[, i] in value) [$]
for (initialization; condition; afterthought) [$]

#### Examples
```
val ex = { hello: "world", well: 'hi you' }

val arr = [for var { key, value } in ex: ]
```

## Switch

// renamed to when
// everything can be on new lines
// can omit parentheses of token
// can omit braces (statements must end with semicolon not required on blocks)
// value can be anything. if value is number then you can place <,<=,>,>= before the values

```
when (token) {
    value1: [expression or { multiline block }]
    value2: [expression or { multiline block }]
    ...
    valueN: [expression or { multiline block }]
    else: [expression or { multiline block }]
}
```

// if

// everything can be on new lines
// can omit parentheses (end condition with then or colon [if condition then or : ...])
// $ = expression or { multiline block }

```
if (condition) [$]
if (condition) [$] else [$]
if (condition) [$] else if (condition) [$] else [$]
```

// while

// everything can be on new lines
// can omit parentheses (end condition with then or colon [if condition then or : ...])

```
while (condition) [expression or { multiline block }]
```

// range
```
token = x..n
```

// try

// can omit braces if it is only one line or expression
// can omit parentheses by catch, but variable must end with colon (:)
```
try { ... } catch (error) { ... }
```

## Examples
```
// variables

immutableValue = 1
mut mutableValue = 1

immutableValue = 2 // Syntax Error: Tried to change a immutable value
mutableValue = 2 // 2

string = "poo"
stringOfMutableValue = "${mutableValue}"
stringOfImmutableValue = "${immutableValue}"

ohANumber = 10

array = ["hello", "world"]
arrayRange = [1..10] // [1, 2, ..., 9, 10]

obj = {}
obj = {
    hello: "world"
    array
    fun -> "This is a FUN function"
}

// functions

hw -> console.log("Hello world")
doubleMe x -> x * 2
doubleUs x = 0 y = 0 -> doubleMe x + doubleMe y
doubleLowNumber num -> if num >= 100: num else num * 2
count *-> for num in 1..10: yield num // Generator

hw() // logs: Hello world
doubleMe(9) // 18
doubleUs(:y = 6) // 12
doubleLowNumber(10) // 20
doubleLowNumber(150) // 150
count().next() // 1
count().next() // 2
doubleMe() // Syntax Error: Parameters cannot be null or undefined

// A "class"
Doge -> {
    constructor suchValue = "much value" -> {

    }
}
```
