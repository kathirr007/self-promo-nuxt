// api/index.js

config.dev = !(process.env.NODE_ENV === 'production')

module.exports = Boolean(config.dev) ? require('../server/index') : require('../server/prod')
