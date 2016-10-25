const Rx = require('rxjs')
const fetch = require('node-fetch')

Rx.Observable.interval(1000)
  .flatMap(() => fetch('http://elasticsearch:9200/_cluster/health?pretty=true'))
  .flatMap(r => r.json())
  .retry()
  .subscribe(body => console.log(body))
