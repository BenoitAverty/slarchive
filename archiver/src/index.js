import {Observable} from 'rxjs'
import Cycle from '@cycle/rxjs-run'
import {pipe, propEq, prop, pick} from 'ramda'

import {slack as slackConfig, elasticsearch as elasticConfig} from 'config'

import {debugEvent} from '~/logger'

import makeSlackDriver, {historyQuery, channelsQuery} from './slack/driver'
import {channelIsWanted} from './slack/utils'
import makeElasticDriver, {insertQuery} from './elasticsearch/driver'

function main(sources) {

  // Query slack driver to send the channels at startup
  const channelsQueries = Observable.of(channelsQuery())

  // Query for channels history when receiving channels
  const historyQueries = sources.slack
    .select('channels')
    .map(prop('channels'))
    .mergeMap(::Observable.from)
    .filter(channelIsWanted)
    .map(pick(['name', 'id']))
    .map(historyQuery)

  // Insert the messages we receive
  const elasticsearchInsertQueries = sources.slack
    .select('history')
    .map(prop('messages'))
    .mergeMap(::Observable.from)
    .do(debugEvent("Received history : "))
    .map(insertQuery)

  return {
    slack: Observable.merge(channelsQueries, historyQueries),
    elasticsearch: elasticsearchInsertQueries
  }
}

// eslint-disable-next-line fp/no-unused-expression
Cycle.run(main, {
  slack: makeSlackDriver(slackConfig),
  elasticsearch: makeElasticDriver(elasticConfig)
})
