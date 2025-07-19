const key="7ac2b1abb9434418a14132829251807";
const inputSearch= document.querySelector('.city-input')
const btnSearch= document.querySelector('.search-btn')
const rowData= document.querySelector('#rowData')
const rowDataDetails= document.querySelector('.current-weather')

console.log(inputSearch,btnSearch,rowData);

let array;

async function callApi(value) {
  const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${value}&days=3`)
  console.log(response);
  let data = await response.json();
  display(data);
}


function display(data) {
  let location = data.location.name;
  let array = data.forecast.forecastday;
  console.log(array);
  
  let cartoona = "";

  for (let i = 0; i < array.length; i++) {
    cartoona += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm border-0" style="transition: 0.3s;">
          <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
            <p class="mb-0 fw-bold">${getDay(array[i].date).day}</p>
            <p class="mb-0 fw-bold">${getDay(array[i].date).month}</p>
          </div>

          <div class="weather-card card h-100 p-3">

            <div class="location h4 mb-2 text-center" style="min-height: 30px;">
              ${i === 0 ? location : "&nbsp;"}
            </div>

            <div class="temperature h1 mb-3 d-flex justify-content-center align-items-center gap-2">
            <div class="text-center">
              <h4>${array[i].day.maxtemp_c} &#8451;</h4>
${i > 0 ? `<h6 class="text-muted">${array[i].day.avgtemp_c} &#8451;</h6>` : ''}
            </div>

              <img src="${i === 0 ? data.current.condition.icon : array[i].day.condition.icon}" alt="weather-icon">
            </div>

            <p class="text-warning text-center">${array[i].day.condition.text}</p>

            ${i === 0 ? `
              <div class="details d-flex justify-content-around text-secondary flex-wrap">
                <span class="h6">
                  <i class="fa-solid fa-umbrella"></i>
                  ${data.current.humidity}%
                </span>
                <span class="h6">
                  <i class="fa-solid fa-wind"></i>
                  ${data.current.wind_kph} km/h
                </span>
                <span class="h6">
                  <i class="fa-solid fa-compass"></i>
                  ${data.current.wind_dir}
                </span>
              </div>
            ` : ""}
          </div>
        </div>
      </div>
    `;
  }

  let secCartoona = `
    <div class="details">
      <h2>${location}</h2>
      <h6>Temperature: ${data.current.temp_c}&#8451;</h6>
      <h6>Wind: ${data.current.wind_kph} km/h</h6>
      <h6>Humidity: ${data.current.humidity}%</h6>
    </div>
  `;

  rowData.innerHTML = cartoona;
  rowDataDetails.innerHTML = secCartoona;
}

function getDay(x){
  let date = new Date(x)
  let day =date.toLocaleString('en-us',{weekday : "long"})
  let month =date.toLocaleString('en-us',{month : "long"})
  return {day, month}
}

inputSearch.addEventListener("input",(e)=>{
  if(e.target.value.length<3) return;
  if(e.target.value){
    callApi(e.target.value)
  }
})

btnSearch.addEventListener("click",function(){
  callApi(inputSearch.value)
})

navigator.geolocation.getCurrentPosition(
  (data)=>{
    let x= data.coords.latitude
    let y= data.coords.longitude
    callApi(`${x},${y}`)
  },
  (err) =>{
    callApi("cairo")
  }
)