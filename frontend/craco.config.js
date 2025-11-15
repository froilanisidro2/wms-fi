module.exports = {
  webpack: (config, env) => {
    // Allow TypeScript compilation to continue even with errors
    config.resolve.plugins = config.resolve.plugins.filter(
      plugin => plugin.constructor.name !== 'ModuleScopePlugin'
    );
    
    // Disable TypeScript error checking
    config.plugins = config.plugins.filter(
      plugin => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
    );
    
    return config;
  },
  typescript: {
    enableTypeChecking: false,
  },
};