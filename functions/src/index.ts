import * as functions from 'firebase-functions';
import { WeatherService } from './service/weatherService';
import * as admin from 'firebase-admin';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const updateWeather = functions.pubsub.schedule('every 120 minutes').onRun(async (context) => {
  functions.logger.info("Function updateWhether triggered", {structuredData: true});
  const service = new WeatherService();
  await service.updateDetail();
});