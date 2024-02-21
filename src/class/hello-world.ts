export class Parent {
  private name: string
  private age: number

  constructor() {
    this.name = 'hwj'
    this.age = 32
  }

  setName(name: string) {
    this.name = name
  }

  setAge(age: number) {
    this.age = age
  }
}

class Student extends Parent {
  work() {
    console.log('我是学生，正在学习....')
  }
}

class Teacher extends Parent {
  work() {
    console.log('我是老师，正在教学....')
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
