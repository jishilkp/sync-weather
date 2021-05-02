import './Weather.css';
import {
  useIonViewDidEnter
} from '@ionic/react';
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { Plugins } from '@capacitor/core';
import { IonLoading } from '@ionic/react';
const { Storage } = Plugins;
const { Geolocation } = Plugins;

interface ContainerProps { }

type Props = ContainerProps;


const Weather: React.FC<Props> = () => {

  const API_KEY  =  "5ad7218f2e11df834b0eaf3a33a39d2a";
  const LOCAL_STORAGE_KEY  =  "weather_data";
  const LOCAL_CACHED_MINUTES =  120;
  const CITY_NAME  =  "mumbai";
  const LAT  =  "";
  const LON  =  "";
  let API_URL  =  `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`;
  let API_URL_LAT_LON  =  `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`;


  const [data, setData] = React.useState({
    name: "",
    dt: "",
    main: {
      temp: 0
    },
    weather: [{
      main: "",
      icon: "03n"
    }]
  });
  const [icon, setIcon] = React.useState("https://static.thenounproject.com/png/967229-200.png");
  const [lastSync, setLastSync] = React.useState("");
  const [showLoading, setShowLoading] = React.useState(false);

  const getWeatherDataFromStorage = async () => {
    const ret = await Storage.get({ key: LOCAL_STORAGE_KEY });
    const weatherData = JSON.parse(ret.value || '{}');
    return weatherData;
  };

  const setWeatherDataToStorage = async (wData: any) => {
    await Storage.set({
      key: LOCAL_STORAGE_KEY,
      value: JSON.stringify(wData),
    });
  };

  const getWeatherFromApi = async () => {
    setShowLoading(true);
    let apiUrl = API_URL;
    const coordinates = await Geolocation.getCurrentPosition();

    /* if(coordinates && coordinates.coords && coordinates.coords.latitude ) {
      apiUrl  =  `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.coords.latitude}&lon=${coordinates.coords.longitude}&appid=${API_KEY}&units=metric`;
    } */
    return axios({
      url: apiUrl,
      method: 'get'
    }).then(response => {
      setShowLoading(false);
      return response.data;
    },(error) => {
      setShowLoading(false);
      console.log(error);
    });
  };

  const formatData = (wData: any) => {
    setData(wData);
    if(wData.weather[0].icon) {
      setIcon(`https://openweathermap.org/img/w/${wData.weather[0].icon}.png`);
    }
    if(wData.dt) {
      let lastSync = moment(wData.dt * 1000).format("DD-MM-YYYY hh:mm a");
      setLastSync(lastSync);
    }
  };

  const setWeatherData = async () => {
    let wData = await getWeatherDataFromStorage();
    const expiryTime = moment.utc().subtract(LOCAL_CACHED_MINUTES, 'minutes');
    let dataCachedTime = moment.utc(wData.dt * 1000);
    if(wData.dt && moment(dataCachedTime).isAfter(expiryTime)) {
      formatData(wData);
    } else {
      getWeatherFromApi().then(wData => {
        if (wData) {
          formatData(wData);
          setWeatherDataToStorage(wData);
        }
      });
    }
  };

  useIonViewDidEnter(() => {
    setWeatherData();
    Plugins.App.addListener('backButton', Plugins.App.exitApp);
  });

  return (
    <>
      <div className="container">
        <div id="icon" className="w-wrapper">
          <div className="location">{data.name}</div>
          <div className="w-name">{data.weather[0].main}</div>
        </div>
        <img className="w-icon" src={icon} alt="Icon"/>
        <div className="temp">{data.main.temp}</div>
        <div className="last-sync">
          <span>Last sync on</span>
          <br></br>
          <span>{lastSync}</span>
        </div>
      </div>
      <IonLoading
        cssClass='my-custom-class'
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Please wait...'}
      />
    </>
  );
};

export default Weather;
