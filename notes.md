# steps to transpile and run the imported program

1. Transpile the file:
    1.1 transpile every imported module
    1.2 If the imported file imports a new file go to step 1
    1.3 If the import is absolute extract from node modules
    1.3 Once done add result to a key map with file name as key

2. Inject all files into app except entry file

3. Inject the entry file a vue app

# Design ideas

## properties
Properties can be defined on the component specifying three things:
- name
- value
- type
- exposed/internal: wether or not the property can be set outside this component

## types

Can be any of:

- true/false -> boolean
- Text -> string
- number -> number

or from more custom types:

- [data] -> object
    - program searches the project for all available data types (defined for UI)
- list of [data]s -> array
    - same as for data

Data types can be defined as interfaces and loaded by the designer application

User can define an initial value on a custom type by opening a dialog and adding
a value for each field

# Designing different states of the program

## if else
An extra property/control for the component to assign an if rule:

Choose between the following rules:

- if [property] is [value] 
    - property can be chosen from the available properties on the component
    - value can be either: given (is provided to the component), 
      not given, or a value appropriate to the type of property
      for example for numbers can be a number and so on
    - e.g. if customer_name is 'pendar'
    - e.g. if temperature is 'celsius'

- if [property] is [comparison operator] [value]
    - if age is greater than 18

## for loop
- An extra control for the component to assign repetition

Chose one of the following:

- Repeat contents for each [item] in [list]
    - list can be chosen from the available properties on the component
    - e.g. Repeat contents for each user in users

- On a component in the contents item can be assigned to a property

- item can be used as a property in any component that is content of the parent component
  using the properties like [property] of [data]
    - e.g. name of user
    - e.g. address of user

## conditional styling
Styles can be set for specific rules for example:

rule: if size is large
```
width: 200px
backgour: beige
etc
```

rule: if size is small
```
width: 30px
background: light blue
```