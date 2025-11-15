// This function initializes the Swagger UI with our custom configuration
// The editor-fold comments are required for the Swagger UI docker image
window.onload = function() {
  
      
      
      
      
      
      
      
      
      
      
      //<editor-fold desc="Changeable Configuration Block">
      
      // Dynamically determine the API URL based on the current host
      // This handles different environments without hardcoding
      const apiPort = window.API_PORT || '8090'; // Default to 8090 if not set
      const currentHost = window.location.hostname;
      const apiUrl = `${window.location.protocol}//${currentHost}:${apiPort}/openapi.json`;
      
      window.ui = SwaggerUIBundle({
        "dom_id": "#swagger-ui",
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        queryConfigEnabled: false,
        url: apiUrl, // Use the dynamically generated URL instead of hardcoded one
        defaultModelsExpandDepth: 2,
        displayRequestDuration: true,
        docExpansion: "list",
        // Enable persistAuthorization to remember API key between page refreshes
        persistAuthorization: true
      })
      
      //</editor-fold>











};
