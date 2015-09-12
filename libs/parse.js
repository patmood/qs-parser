'use strict'
const noop = () => {}

const Utils = require('./utils')

const parse = function(qs, debug) {
  if (!qs) return {}
  // 'a[b]=c&c=d' -> ['a[b]=c', 'c=d']
  let pairs = qs.split('&')
  debug('delimited pairs', pairs)

  // ['a[b]=c', 'c=d'] -> [['a[b]', 'c'], ['c', 'd']]
  pairs = pairs.map((pair) => {
    return pair.split('=')
  })
  debug('split pairs', pairs)

  // [['a[b]', 'c'], ['c', 'd']] -> [[['a', 'b'], 'c'], ['c, 'd']]
  pairs = pairs.map(([fieldKey, fieldValue]) => {
    return [Utils.parseKey(fieldKey), fieldValue]
  })
  debug('parse keys', pairs)

  // [[['a'], 'b'], [['c'], 'd']] -> {a: 'b', c: 'd'}
  // [[['a', 'b'], 'c']] -> {a: [b: 'c']}
  return pairs.reduce((memo, [fieldKey, fieldValue]) => {
    memo[fieldKey] = fieldValue
    return memo
  }, {})
}

module.exports = parse
