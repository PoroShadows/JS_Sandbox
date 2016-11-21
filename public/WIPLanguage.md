# (Name)
(Description)

Index
- [Comments](#comments)
- [Functions](#numbersandstrings)
- [Functions](#function)

### Comments
```
// End of line comment
/* Block comment */
```

Variable
---

```
name
```

Number and Strings
---

String interpolation is done like this "${token}"

```
name = 0
name = ''
name = ""

name = "${name}"
name = '${name}'
```

Array
---
Can omit brackets

```
name = [item1, item2, ..., itemN]
name = item1, item2, ..., itemN
```

Object
---
Can omit braces (not when empty) and commas

```
name = {}
name = { name: value }
name = { n1: v1, n2: v2 }

test = 3

name = { test hi: 'hi there' }
```
Function
---
Can omit the return if expression is at the of the block

Declaration modifiers:

| Mod  |   Showcase     |                           Description                           |
|:----:|:--------------:|:----------------------------------------------------------------|
| none | (... -> ...)   | A regular function                                              |
|  =   | (... => ...)   | Gets the parents scope                                          |
|  :   | (... :-> ...)  | Does not return if expression                                   |
|  :=  | (... :=> ...)  | Gets the parents scope and does not return if it is a expression|
|  *   | (... *-> ...)  | Makes it a generator function                                   |
|  :*  | (... :*-> ...) | Makes a generator that does not return                          |

Parameters can:

1. be named (can not be used by javascript)
2. have default value
3. have the same value as another parameter by using a colon before parameter name
4. omit parentheses around parameters

Function body values:

|     Value      |  Type  |                           Description                           |
|:--------------:|:------:|:----------------------------------------------------------------|
| arguments      | Array  | An array of argument values                                     |
| namedArguments | Object | The key is the argument name and the value is what value it has |

#### Examples

```
add x y -> x + y
run fun :-> fun(...arguments.slice(1))
count :*-> for i = 1; i < 0xff; i++: yield i
```
In js 
```js
function add(x, y) {
    return x + y;
}
function run(fun) {
    fun();
}
function* count() {
    // 0xff = 256
    for (let i = 0; i < 0xff; i++) {
        yield i;
    }
}
```

## For

Can omit parentheses. Must then end with colon or then

for (token[, i] in value) [$]
for (initialization; condition; afterthought) [$]

#### Examples
```
ex = { hello: "world", well: 'hi you' }
exKeys = [ for var [key, value] in ex: key ]
```

## Switch

renamed to when

can omit parentheses of token

can omit braces (statements must end with semicolon not required on blocks)

value can be anything. if value is number then you can place <,<=,>,>= before the values

```
when (token) {
    value1: [expression or { block }]
    value2: [expression or { block }]
    ...
    valueN: [expression or { block }]
    else: [expression or { block }]
}
```

## If

can omit parentheses (end condition with then or colon [if condition then or : ...])


```
if (condition) [$]
if (condition) [$] else [$]
if (condition) [$] else if (condition) [$] else [$]
```

## While

// everything can be on new lines
// can omit parentheses (end condition with then or colon [if condition then or : ...])

```
while (condition) [expression or { multiline block }]
```

## Try

// can omit braces if it is an expression
// can omit parentheses by catch, but variable must end with colon (:)
```
try { ... } catch (error) { ... }
```

### Examples
```
// variables

immutableValue -> 1
mutableValue = 1

immutableValue = 2 // Syntax Error: Tried to change a immutable value
mutableValue = 2 // 2

array = ["hello", "world"]

obj = {}
obj = {
    hello: "world"
    array
    fun: -> "This is a FUN function"
}

// functions

hw :-> console.log("Hello world")
doubleMe x -> x * 2
doubleUs x = 0 y = 0 -> doubleMe x + doubleMe y
doubleLowNumber num -> if num >= 100: num else num * 2
count *-> for num = 1; num <= 10; num++: yield num // Generator

counter -> count()

hw() // logs: Hello world
doubleMe(9) // 18
doubleUs(y = 6) // 12 (doubleMe 0 + doubleMe 6)
doubleLowNumber(10) // 20
doubleLowNumber(150) // 150
counter.next() // 1
counter.next() // 2
doubleMe() // Syntax Error: Parameters cannot be null or undefined
```