import {__, pipe, contains, prop} from 'ramda'

import {slack} from 'config'

/**
 * Predicate that tells if a channel is wanted in the config
 */
export const channelIsWanted = pipe(
 prop('name'),
 contains(__, slack.channels)
)
