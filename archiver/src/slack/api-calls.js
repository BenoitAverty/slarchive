import {Observable} from 'rxjs/Rx'
import fetch from 'node-fetch'
import {__, map, mapObjIndexed, pipe, contains, filter, tap, values, join} from 'ramda'

import config from 'config'

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
  return Observable.from(slackApiCall('channels.list', { exclude_archived: '1' }))
    .map(body => body.channels)
}

/**
 * Fetches the history of the given channel
 */
export function channelsHistory(channelId) {
  return Observable.from(slackApiCall('channels.history', { channel: channelId, count: '10000' }))
    .map(body => body.messages)
}
