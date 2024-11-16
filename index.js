const usertab = document.querySelector("#your-weather");
const searchtab = document.querySelector("#search-weather");
const container = document.querySelector(".container");
const permisson = document.querySelector(".permissionForLocation");
const form_container = document.querySelector(".form-container");
const loading_container = document.querySelector(".loading-container");
const user_info_container = document.querySelector(".user-info-container");
const cards = document.querySelectorAll(".parameter-container");
const card = document.querySelector(".para");


//req variables

let current_tab = usertab;
const api_key ='8627c406e3a845529171c1eee62d2595';

current_tab.classList.add('current-tab');
getfromSessionStorage();

function switchtab(clicked_tab){
    if(current_tab!=clicked_tab){
          current_tab.classList.remove("current-tab");
          current_tab = clicked_tab;
          current_tab.classList.add("current-tab");

         if(!form_container.classList.contains("active")){
            user_info_container.classList.remove("active");
            permisson.classList.remove("active");
            form_container.classList.add("active");
         }
         else{
            form_container.classList.remove("active");
            user_info_container.classList.remove("active");
            getfromSessionStorage();
         }   
    }
}
usertab.addEventListener("click",() =>{
    switchtab(usertab);
})

searchtab.addEventListener("click",() =>{
    switchtab(searchtab);
})


function getfromSessionStorage() {
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        permisson.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        featchUserInfo (coordinates);
    }
}

async function featchUserInfo(coordinates) {
    const{lat,lon} = coordinates;

    //remove permission window
    permisson.classList.remove("active");

    //loading winow active
    loading_container.classList.add("active");

    //call api
    try{
       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`);
       const data = await response.json();

       loading_container.classList.remove("active");
       user_info_container.classList.add("active");
       renderWeatherInfo(data);

    }
    catch(err){
        console.log(err);

    }
    
}


function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("#city-name");
    const cityFlag = document.querySelector("#flag");
    const cityDescription = document.querySelector("#description");
    const descImg = document.querySelector("#desc-img");
    const cityTemp = document.querySelector("#temp");
    const windspeed = document.querySelector("#windspeed");
    const humidity = document.querySelector("#humidity");
    const cloud = document.querySelector("#cloud");

    
    //fetch

    cityName.innerText = weatherInfo?.name;
    cityFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    cityDescription.innerText = weatherInfo?.weather?.[0]?.description;
    descImg.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    cityTemp.innerText = weatherInfo?.main?.temp;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloud.innerText = weatherInfo?.clouds?.all;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("geoLocation Not supported");
    }
}

function  showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates))
    featchUserInfo(userCoordinates);

}


const grantAccess = document.querySelector("#grant-access");
grantAccess.addEventListener("click",getLocation);



async function fetchSearchWeather(cityname){
    loading_container.classList.add('active');
    user_info_container.classList.remove("active");
    permisson.classList.remove("active");

    try{
       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${api_key}&units=metric`);
        const data = await response.json();

        loading_container.classList.remove("active");
        user_info_container.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
       console.log(err);
    }
}


const searchForm = document.querySelector("#searchForm")
const searchInput = document.querySelector("#searchInput");

searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let cityname = searchInput.value;

    if(cityname===""){
        return;
    }
    else{
        fetchSearchWeather(cityname);
    }
})






