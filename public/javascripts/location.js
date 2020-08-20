var xmlhttp = new XMLHttpRequest();
var url = "../db/data.json";
var url_api = "../db/api.json";
var url_office = "../db/office.json";

const input__location = document.querySelector('.input-group #location');
const location__button = document.querySelector('.input-group .location_button');
var myArr = [];

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myArr = JSON.parse(this.responseText);
      }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

input__location.addEventListener("input", function() {
    
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

const map_window = document.querySelector('#map');

location__button.addEventListener("click", function (e) {
  
  e.preventDefault();

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var api = JSON.parse(this.responseText);
        const apiKey = api[0].api;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        document.head.appendChild(script);

        getGeocode(input__location.value, apiKey);
        
      }
  };
  xmlhttp.open("GET", url_api, true);
  xmlhttp.send();

})


function getGeocode(input, apiKey) {

  var data = input.split(' ');
  var address = data[0];

  for(var i =1; i < data.length; i++) {
    address += '+' + data[i];
  }

  var geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

  fetch(geoCodeUrl)
      .then(response => response.json())
      .then(data => {
        
        var geocode = data.results[0].geometry.location;
        var { lat, lng } = geocode;
        
        var long = parseFloat(lng);
        var lati = parseFloat(lat);
        
        initMap(long, lati);
    });
}

let infoWindow;
let currentInfoWindow;
let currentIcon;

function initMap(long, lati) {
  
  document.querySelector('#map').innerHTML = '';

  infoWindow = new google.maps.InfoWindow;
  currentInfoWindow = infoWindow;
  currentIcon = new google.maps.Marker;

  xmlhttp.onreadystatechange = function() {
    
    let map = new google.maps.Map(map_window, {
      center: {lat: lati, lng: long},
      zoom: 12,
      mapTypeControlOptions: {
        mapTypeIds: 'roadmap'
      },
      clickableIcons: false,
      draggableCursor:'default',// this is for cursor type
      minZoom: 10, // this is for min zoom for map
      maxZoom: 15, // this is for max zoom for map    
    });
    
    let check = false;

    if (this.readyState == 4 && this.status == 200) {
        var office_list = JSON.parse(this.responseText);
        
        office_list.forEach((office) => {
          
          if(parseInt(lati) == parseInt(office.lat) && parseInt(long) == parseInt(office.lng)) {
          
          check = true;

          let marker = new google.maps.Marker({
            position: {lat: office.lat, lng: office.lng},
            map: map,
            title: office.name,
            icon: {
              url: '../images/pin.svg',
              scaledSize: new google.maps.Size(40,40),
            }
          });       
          
          google.maps.event.addListener(marker, "click", () => {
            
            let office_info = {
              name: office.name,
              info: office.info,
              address: office.address
            }
            showDetails(office_info, marker);
            
            marker.setIcon({
              url: '../images/pin_color.svg',
              scaledSize: new google.maps.Size(40,40)    
            });
            
            currentIcon.setIcon({
              url: '../images/pin.svg',
              scaledSize: new google.maps.Size(40,40),
            });

            currentIcon = marker;
            input__location.value = office_info.address;
            
          });
        }
      
      });
        
      if(check == false) {
        const sorry = document.createElement("div");
        sorry.classList.add("sorry");
        const markup = "<h3>Sorry we don't have a office in this area</h3>";
        sorry.innerHTML = markup;
        document.querySelector('#map').appendChild(sorry);
      }

        document.querySelector('#map').style.height = '300px';

      }
  };
  xmlhttp.open("GET", url_office, true);
  xmlhttp.send();
}
  
function showDetails(info, marker) {
  
  let placeInfowindow = new google.maps.InfoWindow();
      
      placeInfowindow.setContent(
         `<div><strong>${info.name}</strong><br>
          <strong>${info.info}</strong><br>
          </div>`
      );

      placeInfowindow.open(marker.map, marker);
      currentInfoWindow.close();
      currentInfoWindow = placeInfowindow;
}


function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}