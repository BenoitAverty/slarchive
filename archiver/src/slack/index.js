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

// Returns an observable of all messages in monitored channels
function messagesInMonitoredChannels() {
  // Predicate that tells if a channel is wanted in the config
  const channelIsWanted = pipe(
    prop('name'),
    contains(__, slack.channels)
  )

  const monitoredChannel$ = channelsList()
    .mergeMap(::Observable.from)
    .do(traceEvent('Found channel : %s'))
    .filter(channelIsWanted)
    .map(pick(['name', 'id']))
    .do(debugEvent('Found monitored channel : %s'))

  return monitoredChannel$
    .mergeMap(channelMessages)
}

export const sources = {
  messagesInMonitoredChannels
}
