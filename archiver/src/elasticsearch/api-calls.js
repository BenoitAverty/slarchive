import fetch from 'node-fetch'
import {toString, curry} from 'ramda'

import logger, {traceEvent} from '~/logger'
import {elasticsearch} from 'config'

/**
 * Returns the last message of given channel
 */
function lastMessageOfChannel(channelName) {
  return 1
}

/**
 * Insert a document into elasticsearch, in given index and type.
 */
function insertDocument_(endpoint, index, type, document) {
  logger.trace(`Adding a document into elasticsearch : ${toString(document)} (${elasticsearch.msgIndex}/${elasticsearch.msgType})`)
  return fetch(`${endpoint}/${index}/${type}`, {
    method: 'POST',
    body: toString(document)
  })
  .then(resp => resp.json())
  .then(traceEvent('Response from elasticsearch : %s'))
}
export const insertDocument = curry(insertDocument_)
