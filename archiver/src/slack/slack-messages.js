import Rx from 'rxjs'
import fetch from 'node-fetch'
import {__, pipe, contains, map, filter} from 'ramda'

import {channelsList} from './api-calls'

import config from 'config'

/**
 * Return the ids of every slack channels specified in config
 */
export function channelsToMonitor() {

  // Predicate that tells if a channel is wanted in the config
  const channelIsWanted = pipe(
    channel => channel.name,
    contains(__, config.slack.channels)
  )

  // Return the list of ids of channels to monitor given the list of all channels
  const monitoredChannelsIds = pipe(
    filter(channelIsWanted),
    map(c => c.id)
  )

  return channelsList().then(monitoredChannelsIds)
}
