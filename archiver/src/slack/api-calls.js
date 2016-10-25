import fetch from 'node-fetch'
import {__, map, mapObjIndexed, pipe, contains, filter, tap, keys, join} from 'ramda'

import config from 'config'

function slackApiCall(method, params) {
  const paramsString = pipe(
    mapObjIndexed((k, v) => `${k}=${v}`),
    keys,
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
  return slackApiCall('channels.list', { exclude_archived: '1' })
    .then(body => body.channels)
}

/**
 * Fetches the history of the given channel
 */
export function channelHistory(channelId) {

}
