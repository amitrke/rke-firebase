import fetch from 'node-fetch';
import { Weather } from '../model/types';
import * as admin from 'firebase-admin';

export class WeatherService {

    async updateDetail(){
        const response = await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=29.8667&lon=77.8833&appid=1d5413cd2b2e600f5920fa7cb1df95fb&units=metric&exclude=minutely,hourly`);
        const body: Weather = await response.json();
        var db = admin.database();
        var ref = db.ref("weather").child("roorkee-in");
        await ref.set(body);
        console.log(body);
    }
}