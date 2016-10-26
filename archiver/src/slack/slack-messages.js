import {Observable} from 'rxjs/Rx'
import fetch from 'node-fetch'
import {__, pipe, contains, map, filter} from 'ramda'

import {channelsList, channelsHistory} from './api-calls'

import config from 'config'

/**
 * Return an observable of channel objects (name + ID) corresponding to the channels to monitor for messages
 */
function channelsToMonitor() {
  // Predicate that tells if a channel is wanted in the config
  const channelIsWanted = pipe(
    channel => channel.name,
    contains(__, config.slack.channels)
  )

  return channelsList()
    .mergeMap(::Observable.from)
    .filter(channelIsWanted)
    .map(c => ({ name: c.name, id: c.id }))
}

/**
 * return an obervable of messages from the given channel
 */
function channelMessages(channel) {
  return channelsHistory(channel.id)
    .mergeMap(::Observable.from)
    .map(message => ({ ...message, channel}))
}

/**
 * Returns an observable of all messages in monitored channels.
 */
export function messagesInMonitoredChannels() {
  return channelsToMonitor()
    .mergeMap(channelMessages)
}
