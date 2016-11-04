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
| none| (... ->  ...) | a regular function                                              |
| =   | (... =>  ...) | gets the parents scope                                          |
| *   | (... *-> ...) | makes it a generator function                                   |
| :   | (... :-> ...) | does not return if expression                                   |
| :=  | (... :=> ...) | gets the parents scope and does not return if it is a expression|

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

## For

Can omit parentheses. Must then end with colon or then

for (token[, i] in value) [$]
for (initialization; condition; afterthought) [$]

#### Examples
```
val ex = { hello: "world", well: 'hi you' }

val arr = [for var key, value in ex]
```