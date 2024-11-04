function replace<T extends { new(...args: any[]): {} }>(target: T) {
  console.log("target: ", target);

  return class extends target {
    newname = "newName";
    age = 18
  }
}

@replace
class Demo {
  oldname = "oldname";
  constructor(oldname: string) {
    this.oldname = oldname;
  }
}

console.log(new Demo("oldname"));

function hack(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('target: ', target)
  console.log('target[propertyKey]: ', target[propertyKey])
  console.log('propertyKey: ', propertyKey);
  console.log('descriptor: ', descriptor)

  const oldFunction = target[propertyKey]; // 获取方法引用
  const newFunction = function (...args: any[]) {
    console.log('call function ', propertyKey);
    oldFunction.call(target, ...args);
  }
  descriptor.value = newFunction; // 替换原声明
}

class Demo2 {
  @hack
  demo() {
    console.log('call demo');
  }
}

const demo = new Demo2();
demo.demo();

console.log('------------------函数参数装饰器--------------')

function PathParam(paramDesc: string) {
  return function (target: any, methodName: string, paramIndex: number) {
    console.log('paramDesc: ', paramDesc);
    console.log('target: ', target);
    console.log('methodName: ', methodName);
    console.log('paramIndex: ', paramIndex);

    !target.$meta && (target.$meta = {});
    target.$meta[paramIndex] = paramDesc;
  }
}

class Demo3 {
  constructor() { }
  getUser(
    @PathParam("userId") userId: string,
    @PathParam("age") age: number
  ) {

  }
}

console.log((<any>Demo3).prototype.$meta);
