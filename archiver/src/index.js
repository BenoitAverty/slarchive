const Rx = require('rxjs')
const fetch = require('node-fetch')

Rx.Observable.interval(1000)
  .flatMap(() => fetch('https://jsonplaceholder.typicode.com/posts/1'))
  .flatMap(r => r.json())
  .subscribe(body => console.log(body))
