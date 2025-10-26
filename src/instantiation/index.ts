import { InstantiationService, createDecorator, ServiceCollection, SyncDescriptor, registerSingleton, getSingletonServiceDescriptors, InstantiationType } from 'vscode-instantiation'


const ILogService = createDecorator<ILogService>('logService')

interface ILogService {
  readonly _serviceBrand: undefined
  log(message: string): void
}

class LogService implements ILogService {
  declare readonly _serviceBrand: undefined
  log(message: string): void {
    console.log(message)
  }
}

const IHelloService = createDecorator<IHelloService>('helloService')
interface IHelloService {
  readonly _serviceBrand: undefined
  hello(): void
}
class HelloService implements IHelloService {
  declare readonly _serviceBrand: undefined
  constructor(private name: string) {

  }
  hello(): void {
    console.log('helle', this.name)
  }
}

const IOneHelloService = createDecorator<IOneHelloService>('OneHelloService')
interface IOneHelloService {
  readonly _serviceBrand: undefined
  hello(): void
}
class OneHelloService implements IOneHelloService {
  declare readonly _serviceBrand: undefined
  constructor() {

  }
  hello(): void {
    console.log('helle, OneHelloService')
  }
}

registerSingleton(IOneHelloService, new SyncDescriptor(OneHelloService))


const IMainService = createDecorator<IMainService>('mainService');

interface IMainService {
  readonly _serviceBrand: undefined
  name: string
  add(a: number, b: number): number
}

class MainService implements IMainService {
  declare readonly _serviceBrand: undefined
  name = 'mainService'
  constructor(
    private a: number,
    private b: number,
    @ILogService private logService: ILogService,
    @IHelloService private helloService: IHelloService,
    @IOneHelloService private oneHelloService: IOneHelloService
  ) {
    this.logService.log('I am mainService')
  }
  add() {
    return this.a + this.b
  }

  print() {
    this.helloService.hello()
    this.oneHelloService?.hello()
    this.logService.log(`${this.name} sum: ${this.add()}`)
  }
}

const services  = new ServiceCollection()

services.set(ILogService, new SyncDescriptor(LogService))
services.set(IHelloService, new SyncDescriptor(HelloService, ['SyncDescriptor'], true))

const singletonServices = getSingletonServiceDescriptors()
for (let [id, descriptor] of singletonServices) {
  services.set(id, descriptor);
}

const instantiationService = new InstantiationService(services, true)



// instantiationService.invokeFunction((accessor) => {
//   const mainService = accessor.get(IMainService)
//   const logService = accessor.get(ILogService)

//   const sum = mainService.add(2,4)
//   logService.log(`${mainService.name} sum: ${sum}`)
// })

const mainService = instantiationService.createInstance(MainService, 2, 4)

mainService.print()
