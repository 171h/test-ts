// 代理模式
// 通过包装一个对象以控制对它的访问
import { Logger } from '@171h/log'
import { fetch } from 'ofetch'

const logger = new Logger('proxy.ts')

// 以缓存代理为例
const requestResult = async function (id: string) {
  const requestConfig = {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'force-cache',
  }
  const url = `https://www.baidu.com/s?wd=${id}`
  const response = await fetch(url, requestConfig)
  // const responseJson = await response.json()
  return response
}

interface Proxy {
  cache: Record<string, any>
  request: (id: string) => Promise<any>
}

const proxy: Proxy = {
  cache: {},
  async request(id: string) {
    if (this.cache[id]) {
      // 直接取缓存内容
      return this.cache[id]
    }
    else {
      this.cache[id] = requestResult(id)
      return this.cache[id]
    }
  },
}

logger.verbose('request', await proxy.request('1'))
logger.verbose('request', await proxy.request('1')) // 从缓存获取
