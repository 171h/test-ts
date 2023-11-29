import { Logger } from '@171h/log'
import { getCurrentGitBranch, getCurrentGitRef, getCurrentGitStatus, getGitDiff, loadChangelogConfig, parseCommits } from 'changelogen'

const logger = new Logger('changelogen')

const fromRef = '91327c4f2594389497b9fb853abd0d4fee11fb1c'
const toRef = 'bcc4c0ca9437174ed1f40157e7c39ef75bdaa9f3'

const rawGitCommit = await getGitDiff(fromRef, toRef)

// const gitCommits = parseCommits(rawGitCommit)

logger.log('gitCommits', rawGitCommit)

// logger.log('fromRef', fromRef)

// logger.log('test', await getCurrentGitStatus())
