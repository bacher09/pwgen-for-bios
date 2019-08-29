const { getWebpackConfig } = require('./webpack.base');


module.exports = getWebpackConfig(process.env.PRODUCTION, process.env.GOOGLE_ANALYTICS_TAG);
