require('dotenv').config()
var fetch = require('node-fetch')

const url = 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest'
const token = process.env.TOKEN

async function test() {
  const r = await fetch(url + '', {
    headers: { 'X-CMC_PRO_API_KEY': token, 'Accept': 'application/json' }
  })
  if (!r.ok) return console.log(r.status)
  const j = await r.json()
  console.log(j.data.btc_dominance)
}
test()