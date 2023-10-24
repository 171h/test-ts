import { Logger } from '@171h/log'

const logger = new Logger('iterator.ts')

const iterator = (function () {
  let index = 0
  const data = [1, 2, 3, 4, 5]
  return {
    next() {
      if (!this.hasNext())
        return null
      return data[index++]
    },
    hasNext() {
      return index < data.length
    },
  }
}())

while (iterator.hasNext())
  logger.info('iterator.next()', iterator.next())
