import { Logger } from '@171h/log'

const logger = new Logger('singleton.ts')

// function Person() {
//   if (typeof Person.instance === 'object') {
//       return Person.instance;
//   }
//   this.name = 'vector';
//   this.age = 25;
//   Person.instance = this;
// }

// logger.info('new Person()', new Person())
// logger.info('Person.instance', Person.instance)
// console.dir('Person?.instance', Person?.instance)
