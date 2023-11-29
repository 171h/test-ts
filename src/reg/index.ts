import { Logger } from '@171h/log'
import fs from 'fs-extra'

const logger = new Logger('reg')

const txt = `4 .1 .1 住宅适用性能的评定应包括单元平面、住宅套型、建筑装修、隔声性能、设备设施和无障碍设施6个评定项目，满分为250分。\
\\
TETT

\\
\\
\\


4 .1 .2 住宅适用性能评定指标见本标准附录A。
`

logger.info('txt', txt)

fs.writeFileSync('./regtest.txt', txt)

const txtFix = txt.replaceAll(/\\$/g, 'abc')

logger.info('txtFix', txtFix)
