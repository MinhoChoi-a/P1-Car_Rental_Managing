var xmlhttp = new XMLHttpRequest();
var url = "../db/data.json";

var myArr = '';

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myArr = JSON.parse(this.responseText);
        console.log(myArr);
        myFunction(myArr);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

function myFunction(arr) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<a href="' + arr[i].city_name + '"></a><br>';
    }
    
    console.log(out);    

}

const input__location = document.querySelector('.input-group #location');

input__location.addEventListener("input", function() {
    
    var a, b, i, val = this.value;

    closeAllLists();
    
    if (!val) { return false;}
    
    currentFocus = -1;
    
    a = document.createElement("DIV");
    
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    
    this.parentNode.appendChild(a);
    
    for (i = 0; i < myArr.length; i++) {
      
      if (myArr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + countries[i].substr(0, val.length) + "</strong>";
        b.innerHTML += countries[i].substr(val.length);
        
        b.innerHTML += "<input type='hidden' value='" + countries[i] + "'>";
        
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
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});


