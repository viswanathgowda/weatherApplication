import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  
  public appKey = '37400dcca845924e9ca4f4984fcf10ec';
  public apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
  public weekelyApi = 'https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=';
 
  constructor( private http:HttpClient) { }

  searchWeatherData(location:any) : Observable<any> {
    let queryParam = location + '&appid=' + this.appKey;
    return this.http.get(this.apiUrl + queryParam).pipe(
        catchError((error) =>
          throwError('Error occurred while retrieving logged in user: ' + error)
        )
      );
  }

  getWeeklyData(lat: string, lon: string, day: number) {
var d = new Date();
var now_utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), (d.getDate()-day)));
//console.log(now_utc + 'now_utc');
//console.log(now_utc.getTime()/1000);
      let queryParam = lat + '&lon=' + lon + '&dt=' + (now_utc.getTime()/1000) + '&appid=' + this.appKey;
        return this.http.get(this.weekelyApi + queryParam).pipe(
          catchError((error) =>
            throwError('Error occurred while retrieving logged in user: ' + error)
          )
        );

  }
}
