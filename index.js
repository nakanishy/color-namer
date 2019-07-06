"use strict";

var chroma = require('chroma-js')

// These `require` statements are all explicit
// to keep the browserify build from breaking
var lists = {
  basic: require('./lib/colors/basic'),
  html: require('./lib/colors/html'),
  ntc: require('./lib/colors/ntc'),
  pantone: require('./lib/colors/pantone'),
  roygbiv: require('./lib/colors/roygbiv'),
  x11: require('./lib/colors/x11')
}

let cache = new WeakMap()
var namer = module.exports = function(color, options) {
  options = options || {}

  const cacheKey = {color, options}
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  color = chroma(color)
  var results = {}
  for (var key in lists) {
    if (options.pick && options.pick.indexOf(key) === -1) {
      continue
    }
    if (options.omit && options.omit.indexOf(key) !== -1) {
      continue
    }
    results[key] = lists[key]
      .map (function(name) {
        name.distance = chroma.deltaE(color, chroma(name.hex))
        return name
      })
      .sort (function(a, b) {
        return a.distance - b.distance
      })
  }
  cache.set(cacheKey, results)
  return results
}

namer.chroma = chroma
namer.lists = lists
