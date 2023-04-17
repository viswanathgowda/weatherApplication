import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { reduce } from 'rxjs';
import { styles } from './mapstyles';
import { WeatherService } from './weather.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weathermap';
  public locationsList: any = [];
  public weatherdata: any = [];

  var = 'ram';
  latd: number = 0;
  langtd: number = 0;
  latitude: any;
  longitude: any;

  public weatherDesc: any;
  public mainWeather: string | undefined;
  public wind: string | undefined;
  public pressure: any;
  public temperature: string | undefined;
  public showData = false;



  locationGroup = new FormGroup({
    location: new FormControl(),
  });
  /* 
  Am a barbie Girl, in a barbie world.
  Life in plastic, Its fantastic.
  You can brush my hair, Dress me everywhere.
  Imagination, Thats what creation.
  */
  public date: any;
  public temp: any;
  public weatherdes: any;
  public weatherdescription: any;
  selectedLocation: any;
  selectedLocation2: any;
  selectedlocationstyle: any;
  deactive = {
    color: "white",
    padding: "0.75rem 1.25rem",
    fontSize: "1rem",
    margin: "5px",
    backgroundColor: "red",
    borderRadius: "6px",
    textIndent: "0px",
    textShadow: "none",
    display: "inline-block",
    textAlign: "center",
    textRendering: "auto",
    letterSpacing: "normal",
    wordSpacing: "normal"


  };
  active = {
    color: "white",
    padding: "0.75rem 1.25rem",
    fontSize: "1rem",
    margin: "5px",
    backgroundColor: "green",
    borderRadius: "6px",
    textIndent: "0px",
    textShadow: "none",
    display: "inline-block",
    textAlign: "center",
    textRendering: "auto",
    letterSpacing: "normal",
    wordSpacing: "normal"
  }
  // todayDate =new Date();

  today = new Date();
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
  yyyy = this.today.getFullYear();

  todayDate = this.dd + '/' + this.mm + '/' + this.yyyy;
  screenWidth!: number;

  constructor(private service: WeatherService) { }

  getcurrentLocation(){
    navigator.geolocation.getCurrentPosition((position) =>{
        console.log(position)
        this.latitude = position.coords.latitude;
        this.latd = parseFloat(this.latitude);
        this.longitude = position.coords.longitude;
        this.langtd = parseFloat(this.longitude)
        this.googleMap();
    })
  }
  

  onSubmit(locationValue: any, isPush: boolean, onSelect: boolean) {
    //d  console.log(this.locationGroup.value.location);
    console.log(locationValue);
    let a = this.locationsList.filter((i: { location: any; }) =>
      i.location === this.locationGroup.value.location);
    if (a.length === 0) {
      this.selectedLocation = locationValue;

      this.service.searchWeatherData(this.selectedLocation).subscribe(
        (success) => {
          this.showData = true;
          this.weatherDesc = success.weather[0].description;
          this.mainWeather = success.weather[0].main;
          this.wind = success.wind.speed + 'ms  ' + success.wind.deg + ' deg';
          this.pressure = success.main.pressure;
          this.temperature = (success.main.temp - 273.15).toFixed(1);

          if (isPush) {
            let appendedData = '     ' + this.temperature + 'C ' + this.mainWeather;

            let selectedLocationData: any = {};
            selectedLocationData["data"] = appendedData;
            selectedLocationData["location"] = this.selectedLocation;

            this.locationsList.push(selectedLocationData);

            // console.log(this.locationsList);

          }
          this.latitude = success.coord.lat;
          this.latd = parseFloat(this.latitude);

          this.longitude = success.coord.lon;
          this.langtd = parseFloat(this.longitude);

        //  this.ngOnInit();
          this.googleMap();
          // this.locationGroup.reset();
          this.selectedLocation2 = locationValue;

        },

        (error) => {
          alert('Please enter the valid location');
        }
      );
    }
    else {
      alert('this location is already added');
    }
    this.weatherdata = [];
    //this.selectedLocation2 = locationValue;
    this.locationGroup.reset();

    this.selectedlocationstyle = onSelect;
    console.log(this.selectedlocationstyle);

  }

  private map!: google.maps.Map;


  ngOnInit(): void {
    this.getcurrentLocation()
    this.screenWidth = window.innerWidth
    console.log(this.screenWidth)
  }

  googleMap(){
    let loader = new Loader({
      apiKey: 'AIzaSyCtfYgcatV9vr5B5LhVWFE_2GFgI2IRU_Q'
    })

    loader.load().then(() => {
      console.log(this.latd, this.langtd)
      //   console.log('loaded gmaps')
      this.map = new google.maps.Map(document.getElementById("map")!, {
        center: { lat: this.latd, lng: this.langtd },
        zoom: 8,
        styles: styles
      })

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.latd, this.langtd),
        map: this.map,
      });
    })
  }

  selectedLocations(location: any, isSelect: boolean) {

    this.onSubmit(location, false, false);

    this.selectedLocation2 = this.selectedLocation;
    console.log(this.selectedLocation2);
    this.selectedlocationstyle = isSelect;
    console.log(this.selectedlocationstyle);
    this.weatherdata = [];
  }

  clearWeatherData() {
    this.locationsList = [];
    this.showData = false;
  }
  onDelete(location: any) {

    this.locationsList = this.locationsList.filter((i: { location: any; }) => i.location != location);
    //console.log(this.locationsList);
  }
  onWeeklyStatus(isWeek: boolean) {
    this.weatherdata = [];
    console.log(this.weatherdata)
    for (let i = 0; i < 6; i++) {
      this.service
        .getWeeklyData(this.latitude, this.longitude, i)
        .subscribe((res: any) => {

          var tomorrow = new Date();
          console.log(new Date())
          tomorrow.setDate(tomorrow.getDate() + i + 1);
          console.log(tomorrow, tomorrow.setDate(tomorrow.getDate() + i + 1))
          let date = tomorrow.toLocaleDateString('en-IN', { day: '2-digit', year: 'numeric', month: '2-digit' });
          console.log(date.length);
          res['current'].temp;
          let temp = (res['current'].temp - 273.15).toFixed(1);
          var weatherdes = res['current'].weather[0].description;


          //Array(this.weatherdata.push({date, temp, weatherdes}));
          //this.weatherdata[i] = ({ date, temp, weatherdes });
          this.weatherdata.push({date, temp, weatherdes})
          console.log(this.weatherdata);
          this.selectedlocationstyle = isWeek;
          console.log(this.selectedlocationstyle);


        });
      // console.log("weatherdata", this.weatherdata)

    }


  }
}


