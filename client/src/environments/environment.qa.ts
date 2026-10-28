export const environment = {
  production: false,
  apiUrl: 'https://localhost:9898',
  stripePublishableKey: 'pk_test_51UV3NORhVwldFwDX3VpklHIzxvjuofwEB41BaxCjwAap2o2qRdXPkf0AmRahqDUtVscUcwNl24H7DiTvBImRCFli00a5T6uw1W',
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
