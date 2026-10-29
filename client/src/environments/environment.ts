export const environment = {
  production: true,
  apiUrl: 'https://api.store-front.net',
  stripePublishableKey: 'pk_test_51UV3NORhVwldFwDX3VpklHIzxvjuofwEB41BaxCjwAap2o2qRdXPkf0AmRahqDUtVscUcwNl24H7DiTvBImRCFli00a5T6uw1W',
  featureFlag: false,
  auth0: {
    domain: 'dev-ribr38hk4r55unoz.us.auth0.com',
    clientId: 'KX54ChUpZzvnbUP0U3odcnNcp3afXrwV',
    authorizationParams: {
      redirect_uri: "https://store-front.net",
      audience: "https://api.store-front.net",
    }
  }
};
