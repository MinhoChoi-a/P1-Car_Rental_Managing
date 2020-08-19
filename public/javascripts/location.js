var xmlhttp = new XMLHttpRequest();
var url = "../db/data.json";

var xmlhttp_api = new XMLHttpRequest();
var url_api = "../db/api.json";

const input__location = document.querySelector('.input-group #location');
const location__button = document.querySelector('.input-group .location_button');
var myArr = [];

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myArr = JSON.parse(this.responseText);
        console.log(myArr);
      }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

console.log(input__location);

input__location.addEventListener("input", function() {
    
    console.log(myArr);

    var a, b, i, val = this.value;

    closeAllLists();
    
    if (!val) { return false;}
    
    currentFocus = -1;
    
    a = document.createElement("DIV");
    
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    
    (this.parentNode).parentNode.appendChild(a);
    
    for (i = 0; i < myArr.length; i++) {
      
      if ((myArr[i].city_name).substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + (myArr[i].city_name).substr(0, val.length) + "</strong>";
        b.innerHTML += (myArr[i].city_name).substr(val.length);
        
        b.innerHTML += "<input type='hidden' value='" + (myArr[i].city_name) + "'>";
        
            b.addEventListener("click", function(e) {
        
            input__location.value = this.getElementsByTagName("input")[0].value;
        
            closeAllLists();
        });
        a.appendChild(b);
      }
    }
});

function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != input__location) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});

console.log(location__button);

const map_window = document.querySelector('#map');

location__button.addEventListener("click", function (e) {
  
  xmlhttp_api.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var api = JSON.parse(this.responseText);
        
        const apiKey = api[0].api;
        console.log(apiKey);

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        document.head.appendChild(script);

        getGeocode(input__location.value, apiKey);
        
      }
  };
  xmlhttp_api.open("GET", url_api, true);
  xmlhttp_api.send();

})


function getGeocode(input, apiKey) {

  var data = input.split(' ');
  var address = data[0];

  for(var i =1; i < data.length; i++) {
    address += '+' + data[i];
  }

  console.log(address);

  var geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

  fetch(geoCodeUrl)
      .then(response => response.json())
      .then(data => {
        
        console.log(data);

        var geocode = data.results[0].geometry.location;
        var { lat, lng } = geocode;
        
        var long = parseFloat(lng);
        var lati = parseFloat(lat);
        
        initMap(long, lati);
    });
}

let map;

function initMap(long, lati) {
  
  document.querySelector('#map').style.height = '300px';

  map = new google.maps.Map(map_window, {
    center: {lat: lati, lng: long},
    zoom: 8
  });

  map_window.firstChild.style.position = 'relative';

  console.log(map_window.firstChild);

  console.log(map);
}
  


