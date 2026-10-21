const base = require('./app.json');
module.exports = () => ({
  ...base.expo,
  web: { ...base.expo.web, output: 'single' },
  ios: { ...base.expo.ios, usesAppleSignIn: true, ...(process.env.IOS_BUNDLE_ID ? { bundleIdentifier: process.env.IOS_BUNDLE_ID } : {}) },
  android: { ...base.expo.android, ...(process.env.ANDROID_PACKAGE ? { package: process.env.ANDROID_PACKAGE } : {}) },
  plugins: ['expo-router', 'expo-apple-authentication', ...(process.env.GOOGLE_IOS_URL_SCHEME ? [['@react-native-google-signin/google-signin', { iosUrlScheme: process.env.GOOGLE_IOS_URL_SCHEME }]] : [])],
});
