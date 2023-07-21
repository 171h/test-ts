// @ts-expect-error missing types
import cssToJss from 'jss-cli'
import { infima, microflash, vitepress } from './callout-css'

export enum CalloutThemeTypes {
  INFIMA = 'infima',
  MICROFLASH = 'microflash',
  VITEPRESS = 'vitepress',
}

export function calloutTheme(theme: CalloutThemeTypes) {
  let code = ''
  switch (theme) {
    case 'infima':
      code = infima
      break
    case 'microflash':
      code = microflash
      break
    case 'vitepress':
      code = vitepress
      break
  }
  return cssToJss({ code })
}

const code = calloutTheme(CalloutThemeTypes.INFIMA)
console.log(code)
