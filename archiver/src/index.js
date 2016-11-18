import {Observable} from 'rxjs'
import Cycle from '@cycle/rxjs-run'
import {pipe, propEq, prop, pick} from 'ramda'

import {slack as slackConfig, elasticsearch as elasticConfig} from 'config'

import {debugEvent} from '~/logger'

import makeSlackDriver from './slack/driver'
import {channelIsWanted} from './slack'
// import makeElasticDriver from './elasticsearch/driver'

function main({ slack }) {

  // Query slack driver to send the channels
  const channelsQuery = Observable.of({
    type: 'channels'
  })

  const channels = slack
    .filter(propEq('type', 'channels'))
    .map(prop('payload'))
    .filter(channelIsWanted)
    .map(pick(['name', 'id']))
    .subscribe(debugEvent("Channel  : %s")) // TODO : do something with this and don't subscribe inside main.

  return {
    slack: channelsQuery
  }
}

Cycle.run(main, {
  slack: makeSlackDriver(slackConfig),
  // elasticsearch: makeElasticDriver(elasticConfig)
})
