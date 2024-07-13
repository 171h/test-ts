import { Hookable } from 'hookable'


class Person extends Hookable {
  constructor(name: string){
    super()
    this.name = name
  }

  @f()
  set name(name: string){
    this.callHook('name:change:before', name)
    this._name = name
    this.callHook('name:change:after', name)
  }

  get name(){
    return this._name
  }

  set age(age: number){
    this._age = age
  }
  get age(){
    return this._age
  }
  
  set gender(gender: string){
    this._gender = gender
  }

  get gender(){
    return this._gender
  }

  _name!: string
  _age!: number
  _gender!: string
  private pri = 'private'
}

function changeHook() {
  return function (target: any) {
    // target.hook('name:change:before', (name) => {
    //   console.log(`Name is about to change to ${name}`)
    // })

  }
}

function f() {
  console.log('f求值');
  return function(target: any) {
      console.log('f装饰');
  }
}

function g() {
  console.log('g求值');
  return function(target: any) {
      console.log('g装饰');
  }
}

const person = new Person('Joe')

person.hook('name:change:before', (name) => {
  console.log(`Name is about to change to ${name}`)
})

person.hook('name:change:after', (name) => {
  console.log(`Name changed to ${name}`)
})

person.name = 'Joe2'

console.log(person)

console.log("person.__proto__")
