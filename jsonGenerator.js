
function SqliteAdapter(){
  this.db_file="./db/corona_tracker.db";
  this.db = require('sqlite-sync');
}

SqliteAdapter.prototype.connectDB = function(){
  // open the database
  this.db.connect(this.db_file);
}

SqliteAdapter.prototype.query = function(sql){
  return this.db.run(sql);
}

SqliteAdapter.prototype.close = function(){
  this.db.close();
}

function generateTimelineDataByCountry(country_name){
    var conn = new SqliteAdapter();
    conn.connectDB()
    var rowData = conn.query("select date,cases as num from daily_record where country_name=\""+country_name+"\" order by date asc");
    //console.log(rowData);
    var total_infected_timeline = {};
    rowData.forEach((item, i) => {
       total_infected_timeline[item.date] = item.num;
    });
    var total_deaths_timeline = {};
    rowData = conn.query("select date,deaths as num from daily_record where country_name=\""+country_name+"\" order by date asc");
    rowData.forEach((item, i) => {
       total_deaths_timeline[item.date] = item.num;
    });
    var total_infected = conn.query("select date,cases as num from daily_record where country_name=\""+country_name+"\" order by date desc limit 1");
    var total_deaths = conn.query("select date,deaths as num from daily_record where country_name=\""+country_name+"\" order by date desc limit 1");
    var total_regions = conn.query("select count(distinct(country_name)) as num from daily_record");
    var json = {};
    json['total_infected'] = total_infected[0]['num'];
    json['total_deaths'] = total_deaths[0]['num'];
    json['total_regions'] = total_regions[0]['num'];
    json['total_infected_timeline'] = total_infected_timeline;
    json['total_deaths_timeline'] = total_deaths_timeline;

    conn.close();
    var fs = require('fs');
    try {
      fs.writeFileSync('./data/'+country_name+'/sync.json', JSON.stringify(json), { mode: 0o755 });
    } catch(err) {
      // An error occurred
      console.error(err);
    }

    return json;
}

var test = generateTimelineDataByCountry("China");
console.log(test);
