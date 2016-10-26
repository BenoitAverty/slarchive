import {messagesInMonitoredChannels} from './slack/slack-messages'

/* Subscriptions are in this file, so we disable the unused expressions. */
/* eslint-disable fp/no-unused-expression */

messagesInMonitoredChannels().subscribe(console.log)
