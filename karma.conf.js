// Karma configuration for Front_level_up (Login tests)
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // App sources (order matters)
      { pattern: 'Entrega EVA1/JS/utils/validators.js', watched: true },
      { pattern: 'Entrega EVA1/JS/utils/regions.js', watched: true },
      { pattern: 'Entrega EVA1/JS/utils/cart.js', watched: true },
      { pattern: 'Entrega EVA1/JS/utils/data.js', watched: true },
      { pattern: 'Entrega EVA1/JS/app.js', watched: true },

      // Test specs
      { pattern: 'tests/unit/**/*.spec.js', watched: true }
    ],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};
