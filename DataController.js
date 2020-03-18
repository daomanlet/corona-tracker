// fetch data
$.getJSON( "data/global/statistic.json", function( results ) {
  // copy json object
  jsonData = results;
  // init chart
  initUI(jsonData)
});

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
var chart;
var ctx = document.getElementById("chart-new-cases-dark");
var initUI = function(results){
  initCards(results);
  initChart(results);
}
function initCards(results) {
  document.getElementById("total-infected").innerHTML=results.total_infected;
  document.getElementById("total-deaths").innerHTML=results.total_deaths;
  document.getElementById("total_new_cases_today").innerHTML=results.total_new_cases_today;
  document.getElementById("total_new_deaths_today").innerHTML=results.total_new_deaths_today;
  document.getElementById("total_regions").innerHTML=results.total_regions;
}
function initChart (results) {
    Object.keys(results.total_infected_timeline).forEach(function(key) {
      lineChartData.labels.push(key);
      lineChartData.datasets[0].data.push(results.total_infected_timeline[key]);
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
};
