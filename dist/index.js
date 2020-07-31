
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./h-h.cjs.production.min.js')
} else {
  module.exports = require('./h-h.cjs.development.js')
}
