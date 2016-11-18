import fetch from 'node-fetch'
import {toString} from 'ramda'

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
export function insertDocument(index, type, document) {
  logger.trace(`Adding a document into elasticsearch : ${toString(document)} (${elasticsearch.msgIndex}/${elasticsearch.msgType})`)
  return fetch(`${elasticsearch.endpoint}/${index}/${type}`, {
    method: 'POST',
    body: toString(document)
  })
  .then(resp => resp.json())
  .then(traceEvent('Response from elasticsearch : %s'))
}
