const path = require('path');

module.exports = {
  // Override create-react-app default webpack config
  webpack: {
    configure: (webpackConfig) => {
      // Ignore source map warnings from react-axe
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map from/,
        {
          module: /react-axe/,
        }
      ];
      
      return webpackConfig;
    }
  },
  
  // Add aliases for paths
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@hooks': path.resolve(__dirname, 'src/hooks')
    },
    
    // Fallback for missing modules
    fallback: {
      "fs": false,
      "path": false
    }
  }
}; 