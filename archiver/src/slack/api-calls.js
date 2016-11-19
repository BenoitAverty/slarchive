import {Observable} from 'rxjs'
import fetch from 'node-fetch'
import {__, map, prop, mapObjIndexed, pipe, contains, filter, tap, values, join} from 'ramda'

import config from 'config'
import logger, {debugEvent} from '~/logger'

/**
 * Calls the method provided in the slack API, with the given params, and returns the response as json.
 */
function slackApiCall(method, params) {
  const paramsString = pipe(
    mapObjIndexed((v, k) => `${k}=${v}`),
    values,
    join('&')
  )(params)

  const uri = `${config.slack.endpoint}/${method}?token=${config.slack.token}&${paramsString}`
  return fetch(uri)
    .then(response => response.json())
}

/**
 * Fetches the list of channels from the slack API
 */
export function channelsList() {
  logger.trace(`Making request to channels endpoint.`)

  return Observable.from(
    slackApiCall('channels.list', { exclude_archived: '1' })
  )
}

/**
 * Fetches the history of the given channel
 */
export function channelHistory(channelId) {
  logger.trace(`Making request to history endpoint (${channelId})`)

  return Observable.from(
    slackApiCall('channels.history', { channel: channelId, count: 100 })
  )
}
