export const environment = {
  production: false,
  apiUrl: 'https://localhost:8443',
  featureFlag: true,
  auth0: {
    domain: 'dev-ribr38hk4r55unoz.us.auth0.com',
    clientId: 'jlCBVZSbzpA7eoMG9sv5D0RrvKnGjM71',
    authorizationParams: {
      redirect_uri: "https://localhost:4200",
      audience: "http://localhost:8080",
    }
  }
};
