import { InstantiationService, createDecorator, ServiceCollection } from 'vscode-instantiation'


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
    @ILogService private logService: ILogService
  ) {
    this.logService.log('hello world')
  }
  add() {
    return this.a + this.b
  }

  print() {
    this.logService.log(`${this.name} sum: ${this.add()}`)
  }
}

const services  = new ServiceCollection()

services.set(ILogService, new LogService())
// services.set(IMainService, )

const instantiationService = new InstantiationService(services, true)



// instantiationService.invokeFunction((accessor) => {
//   const mainService = accessor.get(IMainService)
//   const logService = accessor.get(ILogService)

//   const sum = mainService.add(2,4)
//   logService.log(`${mainService.name} sum: ${sum}`)
// })

const mainService = instantiationService.createInstance(MainService, 2, 4)

mainService.print()
