export class Parent {
  private name: string
  private age: number
  static id = 123
  test=''

  constructor() {
    // this.name = 'hwj'
    console.log('this.name = \'hwj\'', this.name = 'hwj')
    this.age = 32
  }

  setName(name: string) {
    this.name = name
  }

  setAge(age: number) {
    this.age = age
  }

  show() {
    console.log(`name: ${this.name}; age: ${this.age}; id: ${Parent.id}`)
  }
}

class Student extends Parent {
  work() {
    console.log('我是学生，正在学习....')
  }
}

class Teacher extends Parent {
  constructor() {
    super()
    Parent.id = 456
  }

  work() {
    console.log('我是老师，正在教学....')
  }

  setAge(age: number): void {
    console.log(age)
  }
}

const s = new Student()
const t = new Teacher()
s.setName('huang xu teng')
s.setAge(4)
t.setName('huang wei jie')
t.setAge(32)

s.work()
t.work()
s.show()
t.show()

interface Jump {
  jump(): void
}

interface Go {
  go(): void
}

// 抽象类
abstract class Animal implements Jump, Go {
  go(): void {
    throw new Error('Method not implemented.')
  }

  jump(): void {
    throw new Error('Method not implemented.')
  }
  public abstract eat(): void
}

class Dog extends Animal {
  public eat(): void {
    console.log('I am a dog, I am eating...')
  }
}

export function testFn(): void
export function testFn(options: { name: string; age: number }): void
export function testFn(options?: { name: string; age?: number }): void {
  console.log('TestFn()')
}

export function useFileSystemAccess(): string
export function useFileSystemAccess(options: { name: string } & { dataType: 'Text' }): string
export function useFileSystemAccess(options: { name: string } & { dataType: 'ArrayBuffer' }): string
export function useFileSystemAccess(options: { name: string } & { dataType: 'Blob' }): string
export function useFileSystemAccess(options: { name: string }): string
export function useFileSystemAccess(options = {}): string {
  return ''
}
