export default {
  // webBaseURL: 'http://api.pa.dev.cronapis.com/api',
  // webBaseURL: 'https://principeazul.cronapis.com:444/api',
  webBaseURL: 'http://127.0.0.1:8000/api',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },
  auth0Config: {
    domain: '',
    clientID: '',
    // make sure this line is contains the port: 8080
    redirectUri: '',
    // we will use the api/v2/ to access the user information as payload
    audience: '',
    responseType: 'token id_token',
    scope: 'openid profile'
  }
}
