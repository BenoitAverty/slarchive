import {sources as slackSources} from './slack'
import {sinks as elasticSinks} from './elasticsearch'

/**
 * Main file of the archiver.
 * Connect sources to appropriate sinks.
 */

// Sources : use sources to retrieve observables of data
const message$ = slackSources.messagesInMonitoredChannels();

// Sinks : pass observables to sinks, they will subscribe and make appropriate write effects
// Disable unused expressions warning when using a sink
// eslint-disable-next-line fp/no-unused-expression
elasticSinks.insertMessages(message$)
