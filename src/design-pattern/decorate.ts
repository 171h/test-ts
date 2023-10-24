import { Logger } from '@171h/log'

const logger = new Logger('decorate.ts')

// 装饰者模式
// 增加普通对象的功能

interface GetPriceDecorator {
  name: string
  getPrice: (price: number) => number | string
}

class Sale {
  constructor(price: number) {
    this.price = price
  }

  private price: number
  private decorators: GetPriceDecorator[] = []

  decorate(d: GetPriceDecorator) {
    this.decorators.push(d)
  }

  getPrice() {
    let price: number | string = this.price
    for (let i = 0; i < this.decorators.length; i++)
      price = this.decorators[i].getPrice(this.price)
    return price
  }
}

const sale = new Sale(100)

const rmbPrice: GetPriceDecorator = {
  name: 'rmb',
  getPrice: (price: number) => {
    return `￥${price}`
  },
}

const taxPrice: GetPriceDecorator = {
  name: 'tax',
  getPrice: (price: number) => {
    return price * 1.05
  },
}

logger.info('sale.getPrice()', sale.getPrice())
sale.decorate(rmbPrice)
sale.decorate(taxPrice)
logger.info('sale.getPrice()', sale.getPrice())
