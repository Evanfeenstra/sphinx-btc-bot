import 'regenerator-runtime/runtime.js';
import * as Sphinx from 'sphinx-bot'
import * as fetch from 'node-fetch'
const msg_types = Sphinx.MSG_TYPE

let initted = false

/*
// SPHINX_TOKEN contains id,secret,and url
// message.channel.send sends to the url the data
*/

const token = process.env.TOKEN
const sphinxToken = process.env.SPHINX_TOKEN
const url = 'https://pro-api.coinmarketcap.com/v1/'
const crypto_route = 'cryptocurrency/quotes/latest'
const global_route = 'global-metrics/quotes/latest'

function init() {
  if (initted) return
  initted = true

  const client = new Sphinx.Client()
  client.login(sphinxToken)

  client.on(msg_types.INSTALL, async (message) => {
    const embed = new Sphinx.MessageEmbed()
      .setAuthor('BitcoinBot')
      .setDescription('Welcome to Bitcoin Bot!')
      .setThumbnail(botSVG)
    message.channel.send({ embed })
  })

  client.on(msg_types.MESSAGE, async (message) => {
    const arr = message.content.split(' ')
    if (arr.length < 2) return
    if (arr[0] !== '/btc') return
    const cmd = arr[1]

    switch (cmd) {

      case 'price':
        console.log("price")
        const isAdmin = message.member.roles.find(role => role.name === 'Admin')
        console.log('=> IS ADMIN?', isAdmin)
        try {
          const r = await fetch(url + crypto_route + '?symbol=BTC&convert=USD', {
            headers: { 'X-CMC_PRO_API_KEY': token, 'Accept': 'application/json' }
          })
          if (!r.ok) return
          const j = await r.json()
          const price = '$' + j.data.BTC.quote.USD.price.toFixed(2)
          const percentChange24 = j.data.BTC.quote.USD.percent_change_24h
          const percentChange24String = percentChange24.toFixed(2) + '%'
          const changeColor = percentChange24 > 0 ? '#00c991' : '#e74744'
          const embed = new Sphinx.MessageEmbed()
            .setAuthor('BitcoinBot')
            .setTitle('Bitcoin Price:')
            .addFields([
              { name: 'Price:', value: price, inline: true },
              { name: '24 Hour Change:', value: percentChange24String, inline: true, color: changeColor }
            ])
            .setThumbnail(botSVG)
          message.channel.send({ embed })
        } catch (e) {
          console.log('BTC bot error', e)
        }
        return

      case 'sats':
        console.log("sats")
        try {
          const r = await fetch(url + crypto_route + '?symbol=BTC&convert=USD', {
            headers: { 'X-CMC_PRO_API_KEY': token, 'Accept': 'application/json' }
          })
          if (!r.ok) return
          const j = await r.json()
          const price = j.data.BTC.quote.USD.price / 100000000
          const sats = Math.round(1 / price) + ''
          const embed = new Sphinx.MessageEmbed()
            .setAuthor('BitcoinBot')
            .setTitle('Sats:')
            .addFields([
              { name: 'Sats per dollar:', value: sats, inline: true },
            ])
            .setThumbnail(botSVG)
          message.channel.send({ embed })
        } catch (e) {
          console.log('BTC bot error', e)
        }
        return

      case 'dominance':
        console.log("dominance")
        try {
          const r = await fetch(url + global_route, {
            headers: { 'X-CMC_PRO_API_KEY': token, 'Accept': 'application/json' }
          })
          if (!r.ok) return
          const j = await r.json()
          const d = j.data.btc_dominance.toFixed(2) + '%'
          const embed = new Sphinx.MessageEmbed()
            .setAuthor('BitcoinBot')
            .setTitle('BTC Dominance:')
            .addFields([
              { name: 'BTC Dominance:', value: d, inline: true },
            ])
            .setThumbnail(botSVG)
          message.channel.send({ embed })
        } catch (e) {
          console.log('BTC bot error', e)
        }
        return

      default:
        const embed = new Sphinx.MessageEmbed()
          .setAuthor('BitcoinBot')
          .setTitle('BitcoinBot Commands:')
          .addFields([
            { name: 'Print BTC price', value: '/btc price' },
            { name: 'Sats per dollar', value: '/btc sats' },
            { name: 'Help', value: '/btc help' }
          ])
          .setThumbnail(botSVG)
        message.channel.send({ embed })
        return
    }
  })
}

const botSVG = `<svg viewBox="64 64 896 896" height="12" width="12" fill="white">
  <path d="M300 328a60 60 0 10120 0 60 60 0 10-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 10120 0 60 60 0 10-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
</svg>`

init()