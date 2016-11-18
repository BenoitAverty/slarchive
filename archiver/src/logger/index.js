/* eslint-disable fp/no-mutation, better/no-new */
import winston from 'winston'
import {replace,curry,toString} from 'ramda'

import config from 'config'

// Custom log levels
const levels = {
  critical: 0,
  error: 1,
  info: 2,
  debug: 3,
  trace: 4,
}

// Configure logger
const logger = new winston.Logger({
  levels,
  level: config.log.level,
  transports: [
    new (winston.transports.Console)(),
  ]
})

const boundLog = logger.log.bind(logger)

const logEvent = curry(
  (level, template, event) => boundLog(level, template, toString(event))
)

// Export utility functions
export const traceEvent = logEvent('trace')
export const debugEvent = logEvent('debug')
export const infoEvent = logEvent('info')
export const errorEvent = logEvent('error')

export default logger;
