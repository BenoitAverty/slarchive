import Rx from 'rxjs/Rx'
import fetch from 'node-fetch'
import {__, pipe, contains, map, filter} from 'ramda'

import {channelsList, channelsHistory} from './api-calls'

import config from 'config'

const Observable = Rx.Observable

/**
 * Return an observable of channel IDs corresponding to the channels to monitor for messages
 */
function channelsToMonitor() {
  // Predicate that tells if a channel is wanted in the config
  const channelIsWanted = pipe(
    channel => channel.name,
    contains(__, config.slack.channels)
  )

  return Observable.from(channelsList())
    .mergeMap(::Observable.from)
    .filter(channelIsWanted)
    .map(c => c.id)
}

/**
 * return an obervable of messages from the given channel ID
 */
function channelMessages(channelId) {
  return Observable.from(channelsHistory(channelId))
    .mergeMap(::Observable.from)
}

/**
 * Returns an observable of all messages in monitored channels.
 */
export function messagesInMonitoredChannels() {
  return channelsToMonitor()
    .mergeMap(channelMessages)
}
