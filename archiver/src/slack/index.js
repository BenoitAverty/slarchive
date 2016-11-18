import {Observable} from 'rxjs/Rx'
import fetch from 'node-fetch'
import {__, pipe, contains, map, filter, prop, pick} from 'ramda'

import {debugEvent, traceEvent} from '~/logger'

import {channelsList, channelsHistory} from './api-calls'

import {slack} from 'config'

/**
 * return an obervable of messages from the given channel
 */
function channelMessages(channel) {
  return channelsHistory(channel.id)
    .mergeMap(::Observable.from)
    .map(message => ({ ...message, channel}))
}

/**
 * Predicate that tells if a channel is wanted in the config
 */
export const channelIsWanted = pipe(
 prop('name'),
 contains(__, slack.channels)
)

// const monitoredChannels = channelsList()
//   .mergeMap(::Observable.from)
//   .do(traceEvent('Found channel : %s'))
//   .filter(channelIsWanted)
//   .map(pick(['name', 'id']))
//   .do(debugEvent('Found monitored channel : %s'))
//
// const messagesInMonitoredChannels =
//   return monitoredChannels
//     .mergeMap(channelMessages)
// }
//
// export const sources = {
//   messagesInMonitoredChannels
// }
