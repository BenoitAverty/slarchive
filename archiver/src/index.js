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

  const historyQueries = sources.slack
    .select('channels')
    .filter(channelIsWanted)
    .map(pick(['name', 'id']))
    .map(historyQuery)

  const elasticsearchInsertQueries = sources.slack
    .select('history')
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
