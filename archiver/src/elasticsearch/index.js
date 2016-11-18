import logger, {errorEvent} from '~/logger'

import {insertDocument} from './api-calls'
import {elasticsearch} from 'config'

// Sinks : these functions are responsible of all side-effects on the outside worlds. They take
// observable as parameter and contain some subscriptions. Only sinks can use 'subscribe()'
/* eslint-disable fp/no-unused-expression, fp/no-nil, better/explicit-return */
export const sinks = {
  insertMessages(message$) {
    message$.subscribe(
      msg => {
        insertDocument(elasticsearch.msgIndex, elasticsearch.msgType, msg)
          .catch(errorEvent('Caught error while inserting a document into elasticSearch : %s'))
      }
    )
  }
}
