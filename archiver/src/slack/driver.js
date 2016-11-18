import {pipe, prop, propEq, equals, __, assoc, always} from 'ramda'
import {Subject} from 'rxjs'

import {debugEvent} from '~/logger'

import {channelsList, channelHistory} from './api-calls'

// A channel query. No need for a function since it has no payload
export const channelsQuery = always({
  type: 'channels'
})

// Check if a query is for the channels endpoint
const isChannelQuery = pipe(
  prop('type'),
  equals('channels')
)

// Make a object to send in source
const channelResult = pipe(
  assoc('payload', __, {}),
  assoc('type', 'channels')
)

// Create a query for the history of the given channel
export const historyQuery = pipe(
  assoc('payload', __, {}),
  assoc('type', 'history')
)

const isHistoryQuery = pipe(
  prop('type'),
  equals('history')
)

const historyResult = pipe(
  assoc('payload', __, {}),
  assoc('type', 'history')
)

export default function makeSlackDriver(config) {
  function slackDriver(sinks) {
    const source = new Subject()

    const channelsQueries = sinks
      .filter(isChannelQuery)
      .do(debugEvent('Slack driver received a channels query'))
    const historyQueries = sinks
      .filter(isHistoryQuery)
      .map(prop('payload'))
      .do(debugEvent('Slack driver received an history query : %s'))

    channelsQueries
      .mergeMap(channelsList)
      .mergeMap(::Observable.from)
      .map(channelResult)
      .subscribe(::source.next)

    historyQueries
      .mergeMap(channel =>
        channelHistory(channel.id)
          .mergeMap(::Observable.from)
          .map(assoc('channel', channel))
      )
      .map(historyResult)
      .subscribe(::source.next)

    return {
      select: type => source
        .filter(propEq('type', type))
        .map(prop('payload'))
    }
  }

  return slackDriver
}
