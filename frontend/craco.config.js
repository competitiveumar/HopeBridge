const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore source map warnings from react-axe
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        {
          module: /react-axe/,
        }
      ];
      
      // Add aliases for better imports
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@hooks': path.resolve(__dirname, 'src/hooks')
      };
      
      return webpackConfig;
    }
  }
}; 