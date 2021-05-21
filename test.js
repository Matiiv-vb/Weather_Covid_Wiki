let ukr = document.getElementById('ukr');
let allCity = document.getElementById('allCity');
let radioBut = document.querySelector('.radBut');
let datalist = document.getElementById('variant');
let inputCity = document.querySelector('.input')
let city = '';
let respjson = '';

radioBut.addEventListener('change', (event) => {
  console.log(event);
  if (event.srcElement.id == 'ukr') {
    async function a() {
      respjson = await fetch("./cityjson/Ukraine.json");
      city = await respjson.json();
      datalist.innerHTML = '';
      inputCity.value = '';
      addFragment(city);
    }
    a();
  } else if (event.srcElement.id == 'allCity') {
    async function b() {
      respjson = await fetch("./cityjson/city.list.json");
      city = await respjson.json();
      datalist.innerHTML = '';
      inputCity.value = '';
      addFragment(city);
    }
    b();
  }

});



respjson = await fetch("./cityjson/Ukraine.json");
city = await respjson.json();
console.log(city);


function addFragment(ecity) {

  let fragment = document.createDocumentFragment();

  ecity.forEach(function (el) {
    let option = document.createElement('option');
    let data = `${el.name},${el.country}`
    let text = document.createTextNode(data);

    option.value = data;
    option.appendChild(text);
    fragment.appendChild(option);
  });

  datalist.appendChild(fragment);

}


addFragment(city);



//////////////////////

let buttonShow = document.querySelector('.buttonShow');
let buttonIp = document.querySelector('.buttonIp');



buttonIp.onclick = async function () {

  // https://api.techniknews.net/ipgeo/
  // https://ipinfo.io/json?token=c53e5677671c54
  let respip = await fetch("https://api.techniknews.net/ipgeo/");
  let cityip = await respip.json();
  inputCity.value = `${cityip.city},${cityip.countryCode}`

}

let key1 = '70e1ed322b02acbc57d443dd91065f3e'
let key2 = '0be3d3145393b46c0f8a8f2d602981dc'


let cityDeskr = document.querySelector('.cityDeskr');
let weather = document.querySelector('.weather');
let minImg = document.querySelector('.minImg');
let temp = document.querySelector('.temp');
let humidity = document.querySelector('.humidity');
let press = document.querySelector('.press');
let visibility = document.querySelector('.visibility');
let wind = document.querySelector('.wind');
let map = document.querySelector('.map');
let areaWiki = document.querySelector('.areaWiki');

let regions = document.querySelector('.regions');
let activecase = document.querySelector('.activecase');
let death = document.querySelector('.death');
let recover = document.querySelector('.recover');
let test = document.querySelector('.test');
let total = document.querySelector('.total');

let activecase_all = document.querySelector('.activecase_all');
let death_all = document.querySelector('.death_all');
let recover_all = document.querySelector('.recover_all');
let test_all = document.querySelector('.test_all');
let total_all = document.querySelector('.total_all');



buttonShow.onclick = async function () {
  console.log(inputCity.value);

  let respjson = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&lang=uk&appid=${key2}`);
  let arr = await respjson.json();
  console.log(arr);

  cityDeskr.textContent = `${arr.name}`;
  weather.textContent = `${arr.weather[0].description}`;
  minImg.innerHTML = `<img src="https://openweathermap.org/img/wn/${arr.weather[0]['icon']}@2x.png" height="200" width="200">`;
  temp.innerHTML = `${Math.round(arr.main.temp - 273)} &deg;`;
  humidity.textContent = `${arr.main.humidity}%`;
  press.innerHTML = `${Math.round(arr.main.pressure *  0.00750063755419211 * 100)} мм.рт.ст`;
  visibility.innerHTML = `${arr.visibility/1000} км`;
  wind.innerHTML = `${arr.wind.speed} м/с`;

  let lat = arr.coord.lat;
  let lon = arr.coord.lon;
  let latDMS = getDMS(lat, 'lat');
  let lonDMS = getDMS(lon, 'long');

  map.innerHTML = `<a href="https://geohack.toolforge.org/geohack.php?language=uk&params=${latDMS}${lonDMS}scale:100000_region:UA" target="_blank">Подивитись на карті</a>  `;

  let wiki = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${arr.name}`);
  let dataWiki = await wiki.json();
  console.log(dataWiki);
  console.log(dataWiki.query.search);

  let headWiki = document.querySelector('.headWiki')
  headWiki.innerHTML = `Дані з Wikipedia(en) про: ${arr.name}`
  areaWiki.innerHTML = '';
  dataWiki.query.search.forEach(function (e) {

    let a = document.createElement('a');
    a.setAttribute("href", `https://en.wikipedia.org/?curid=${e.pageid}`);
    a.setAttribute("target", "_blank");
    a.innerHTML = `${e.title}<br>`;
    areaWiki.appendChild(a);
  })

  let response_covid = await fetch(`https://api.quarantine.country/api/v1/summary/latest`);
  let arr_covid = await response_covid.json();
  console.log(arr_covid);

  let key_region = '';

  for (let key in arr_covid.data.regions) {

    if (arr_covid.data.regions[key].iso3166a2 == arr.sys.country) {

      key_region = key;
    }
  }
  console.log(arr_covid.data.regions[key_region]);

  let array_region = arr_covid.data.regions[key_region];

  regions.innerHTML = `${array_region.name}`;

  activecase.innerHTML = `${array_region.active_cases}(${array_region.change.active_cases})`;

  death.innerHTML = `${array_region.deaths}(+${array_region.change.deaths})`;

  recover.innerHTML = `${array_region.recovered}(+${array_region.change.recovered})`;

  test.innerHTML = `${array_region.tested}`;

  total.innerHTML = `${array_region.total_cases}(+${array_region.change.total_cases})`;

  let array_sum = arr_covid.data.summary;
  let array_change = arr_covid.data.change;

  activecase_all.innerHTML = `${array_sum.active_cases}(${array_change.active_cases})`;

  death_all.innerHTML = `${array_sum.deaths}(+${array_change.deaths})`;

  recover_all.innerHTML = `${array_sum.recovered}(+${array_change.recovered})`;

  test_all.innerHTML = `${array_sum.tested}(+${array_change.tested})`;

  total_all.innerHTML = `${array_sum.total_cases}(+${array_change.total_cases})`;

}





///////////////////////

function truncate(n) {
  return n > 0 ? Math.floor(n) : Math.ceil(n);
}

function getDMS(dd, longOrLat) {
  let hemisphere = /^[WE]|(?:lon)/i.test(longOrLat) ?
    dd < 0 ?
    "W" :
    "E" :
    dd < 0 ?
    "S" :
    "N";

  const absDD = Math.abs(dd);
  const degrees = truncate(absDD);
  const minutes = truncate((absDD - degrees) * 60);
  const seconds = ((absDD - degrees - minutes / 60) * Math.pow(60, 2)).toFixed(2);

  let dmsArray = [degrees, minutes, seconds, hemisphere];
  return `${dmsArray[0]}_${dmsArray[1]}_${dmsArray[2]}_${dmsArray[3]}_`;
}




// let transliterate = function (text) {

//   text = text
//     //  .replace(/-/g, ' ') 
//     .replace(/kh/g, 'х')
//     .replace(/ts/g, 'ц')
//     .replace(/ch/g, 'ч')
//     .replace(/sh/g, 'ш')
//     .replace(/shch/g, 'щ')
//     .replace(/’/g, 'ь')
//     .replace(/yu/g, 'ю')
//     .replace(/iu/g, 'ю')
//     .replace(/ya/g, 'я')
//     .replace(/ia/g, 'я')
//     .replace(/zgh/g, 'зг')
//     .replace(/yi/g, 'ї')
//     .replace(/ye/g, 'є')
//     .replace(/ie/g, 'є')
//     .replace(/zh/g, 'ж')
//     .replace(/a/g, 'а')
//     .replace(/b/g, 'б')
//     .replace(/v/g, 'в')
//     .replace(/h/g, 'г')
//     .replace(/g/g, 'ґ')
//     .replace(/d/g, 'д')
//     .replace(/e/g, 'е')
//     .replace(/z/g, 'з')
//     .replace(/y/g, 'и')
//     .replace(/i/g, 'і')
//     .replace(/y/g, 'й')
//     .replace(/k/g, 'к')
//     .replace(/l/g, 'л')
//     .replace(/m/g, 'м')
//     .replace(/n/g, 'н')
//     .replace(/o/g, 'о')
//     .replace(/p/g, 'п')
//     .replace(/r/g, 'р')
//     .replace(/s/g, 'с')
//     .replace(/t/g, 'т')
//     .replace(/u/g, 'у')
//     .replace(/f/g, "ф");



//   return text;
// };

//let s = arr.name.toLocaleLowerCase();
// let trName = transliterate(s);
// console.log(trName);

//////////////////////