
var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

var ctx = document.getElementById("chart-new-cases-dark");
var global_ret;
//autocomplete(document.getElementById("searchTxt"), countries);

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,autocomplete(document.getElementById("myInput"), countries);

  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "form-control");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
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
}

function search(ele){
  if(event.key === 'Enter') {
      //alert(ele.value);
      reload("data/"+ele.value+"/sync.json");
      document.getElementById("breadcrumb-current-item").innerHTML=ele.value;
  }
}

function onCard(ele){
  if(ele.id=="infected-card"){
    initChart(global_ret.total_infected_timeline);
  }else if(ele.id=="new-deaths-card"){
    initChart(global_ret.new_deaths_timeline);
  }else if(ele.id=="newcases-card"){
    initChart(global_ret.new_cases_timeline);
  }else if(ele.id=="deaths-card"){
    initChart(global_ret.total_deaths_timeline);
  }else{

  }

}
function initUI (results){
  initCards(results);
  initChart(results.total_infected_timeline);
  refreshTable(results);
}

function refreshTable(results){
  var regionListData = '';
  results.table_data.forEach((item, i) => {
    regionListData += '<tr><th scope="row">'+item.region+"</th>";
    regionListData += '<td>'+item.infecteds+"</td>";
    regionListData += '<td>'+item.newcases+"</td>";
    regionListData += '<td>'+item.deaths+"</td></tr>";
  });
  document.getElementById("table_data").innerHTML=regionListData;
}

function initCards(results) {
  document.getElementById("total-infected").innerHTML=results.total_infected;
  document.getElementById("total-deaths").innerHTML=results.total_deaths;
  document.getElementById("total_new_cases_today").innerHTML=results.total_new_cases_today;
  document.getElementById("total_new_deaths_today").innerHTML=results.total_new_deaths_today;
  document.getElementById("total_regions").innerHTML=results.total_regions;
}

function removeData(chartData) {
    chartData.labels.pop();
    chartData.datasets.forEach((dataset) => {
        dataset.data.pop();
    });

}
var chart;
function initChart (lineData) {
    //removeData(lineChartData);
    var lineChartData = {
      labels: [], // currently empty will contain all the labels for the data points
      datasets: [
        {
          label: "Total Bills",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: [] // currently empty will contain all the data points for bills
        }
      ]
    };

    Object.keys(lineData).forEach(function(key) {
      lineChartData.labels.push(key);
      lineChartData.datasets[0].data.push(lineData[key]);
    });
    chart = new Chart(ctx, {
      type: 'line',
      data: lineChartData,
      options: {
        responsive: true,
        legend: {
          display: false
        },
        elements:{
          point:{
            radius:0
          }
        },
        scales:{
          xAxes:[
            {
              gridLines:{
                display:false
              }
            }
          ],
          yAxes:[
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
}

function reload(ajaxURL){
  $.getJSON( ajaxURL, function( results ) {
    global_ret = results;
    // init chart
    initUI(results)
  }).done(function() {
      console.log( "second success" );
    })
    .fail(function(jqXHR, textStatus) {
      alert( "Request failed: " + textStatus );
      console.log( "error" );
    })
    .always(function() {
      console.log( "complete" );
    });
}

reload("data/global/statistic.json");
