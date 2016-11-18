import {pipe, prop, propEq, equals, __, assoc} from 'ramda'
import {Subject} from 'rxjs'

import {debugEvent} from '~/logger'

import {insertDocument} from './api-calls'


// Create a query to insert a document into elasticsearch
export const insertQuery = pipe(
  assoc('payload', __, {}),
  assoc('type', 'insert')
)

// Check if a query is an insert query
const isInsertQuery = pipe(
  prop('type'),
  equals('insert')
)

// make the result of an insert query
const insertResult = pipe(
  assoc('payload', __, {}),
  assoc('type', 'insert')
)

export default function makeElasticDriver(config) {
  function elasticDriver(sinks) {
    const source = new Subject()

    const insertQueries = sinks
      .filter(isInsertQuery)
      .map(prop('payload'))
      .do(debugEvent('Elastic driver received an insert query : %s'))

    insertQueries
      .mergeMap(insertDocument(config.endpoint, config.msgIndex, config.msgType))
      .map(insertResult)
      .subscribe(::source.next)

    return source
  }

  return elasticDriver
}
