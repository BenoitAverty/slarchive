import {pipe, prop, equals, __, assoc} from 'ramda'
import {Subject} from 'rxjs'

import {channelsList} from './api-calls'

// Check if a query is for the channels endpoint
const isChannelQuery = pipe(
  prop('type'),
  equals('channels')
)

// Make a object to send in source
const channelResponse = pipe(
  assoc('payload', __, {}),
  assoc('type', 'channels')
)

export default function makeSlackDriver(config) {
  function slackDriver(sinks) {
    const source = new Subject()

    const channelsQueries = sinks
      .filter(isChannelQuery)

    channelsQueries
      .mergeMap(channelsList)
      .mergeMap(::Observable.from)
      .map(channelResponse)
      .subscribe(::source.next)

    return source
  }

  return slackDriver
}
