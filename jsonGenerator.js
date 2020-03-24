
function SqliteAdapter(){
  this.db_file="./db/corona_tracker.db";
  this.db = require('sqlite-sync');
}

SqliteAdapter.prototype.connectDB = function(){
  // open the database
  this.db.connect(this.db_file);
}

SqliteAdapter.prototype.query = function(sql){
  console.log("query:" + sql);
  return this.db.run(sql);
}

SqliteAdapter.prototype.close = function(){
  this.db.close();
}

function JsonGenerator(){
  this.fileSystem = require('fs');
  this.conn = new SqliteAdapter();
  this.conn.connectDB();
}

JsonGenerator.prototype.generateJsonDataByCountry = function(){
  var regions = this.conn.query("select distinct(country_name) as name from daily_record");
  regions.forEach((item, i) => {
    var folderName = item['name'].replace(/\s/g, '').toLowerCase();
    var dir = './data/'+folderName;
    console.log(dir);
    if (!this.fileSystem.existsSync(dir)){
        this.fileSystem.mkdirSync(dir);
    }
    this.generateTimelineDataByCountry(item['name'],dir);
  });
}

JsonGenerator.prototype.close = function(){
  this.conn.close();
}

JsonGenerator.prototype.generateIncreaseNum = function(rowData){
  var ret = [];
  var previous = 0;
  for(var i=0; i<rowData.length;i++){
    var item = rowData[i];
    var temp = {};
    if(i>0){
      temp[item.date] = item.num-previous;
    }else{
      temp[item.date] = 0;
    }
    ret.push(temp);
    previous = item.num;
  }
  return ret;
}

JsonGenerator.prototype.global = function(){
  if (!this.fileSystem.existsSync('./data/global')){
      this.fileSystem.mkdirSync('./data/global');
  }
  var json = {};
  var rowData = this.conn.query("select date,sum(cases) as num from daily_record group by date order by date asc");
  //console.log(rowData);
  var total_infected_timeline = {};
  rowData.forEach((item, i) => {
     total_infected_timeline[item.date] = item.num;
  });
  var new_cases_timeline = {};
  var new_cases_lastDay = {};
  var ret = this.generateIncreaseNum(rowData);
  for(var i = 0 ; i<ret.length;i++){
    var item = ret[i];
    var key = Object.keys(item);
    new_cases_timeline[key[0]] = item[key[0]];
    if(i==ret.length-1){
      new_cases_lastDay['date'] = key[0];
      new_cases_lastDay['num'] = item[key[0]];
      json['total_new_cases_today'] = item[key[0]]
    }
  }
  var total_deaths_timeline = {};
  rowData = this.conn.query("select date,sum(deaths) as num from daily_record group by date order by date asc");
  rowData.forEach((item, i) => {
     total_deaths_timeline[item.date] = item.num;
  });
  var new_deaths_timeline = {};
  ret = this.generateIncreaseNum(rowData);
  for(var i = 0 ; i<ret.length;i++){
    var item = ret[i];
    var key = Object.keys(item);
    new_deaths_timeline[key[0]] = item[key[0]];
    if(i==ret.length-1){
        json['total_new_deaths_today'] = item[key[0]]
    }
  }
  var total_infected = this.conn.query("select date,sum(cases) as num from daily_record group by date order by date desc limit 1");
  var total_deaths = this.conn.query("select date,sum(deaths) as num from daily_record group by date order by date desc limit 1");
  var total_regions = this.conn.query("select count(distinct(country_name)) as num from daily_record");
  var region_table_data = [];
  rowData = this.conn.query("select Max(date) as date, country_name, cases, deaths from daily_record group by country_name order by cases desc");
  rowData.forEach((item, i) => {
    var tmp = {};
    tmp['region']=item.country_name;
    tmp['Infecteds']=item.cases;
    tmp['deaths']=item.deaths;
    if(item.date == new_cases_lastDay.date){
      tmp['newcases']=new_cases_lastDay.num;
    }
    region_table_data.push(tmp);
  });
  json['total_infected'] = total_infected[0]['num'];
  json['total_deaths'] = total_deaths[0]['num'];
  json['total_new_deaths_today'] =
  json['total_regions'] = total_regions[0]['num'];
  json['total_infected_timeline'] = total_infected_timeline;
  json['new_cases_timeline'] = new_cases_timeline;
  json['total_deaths_timeline'] = total_deaths_timeline;
  json['new_deaths_timeline'] = new_deaths_timeline;
  json['table_data'] = region_table_data;
  try {
    this.fileSystem.writeFileSync('./data/global/sync.json', JSON.stringify(json), { mode: 0o755 });
  } catch(err) {
    // An error occurred
    console.error(err);
  }
  return json;
}

JsonGenerator.prototype.generateTimelineDataByCountry = function(country_name,fileName){
    var json = {};
    var rowData = this.conn.query("select date,cases as num from daily_record where country_name=\""+country_name+"\" order by date asc");
    //console.log(rowData);
    var total_infected_timeline = {};
    rowData.forEach((item, i) => {
       total_infected_timeline[item.date] = item.num;
    });
    var new_cases_timeline = {};
    var new_cases_lastDay = {};
    var ret = this.generateIncreaseNum(rowData);
    for(var i = 0 ; i<ret.length;i++){
      var item = ret[i];
      var key = Object.keys(item);
      new_cases_timeline[key[0]] = item[key[0]];
      if(i==ret.length-1){
        new_cases_lastDay['date'] = key[0];
        new_cases_lastDay['num'] = item[key[0]];
        json['total_new_cases_today'] = item[key[0]]
      }
    }
    var total_deaths_timeline = {};
    rowData = this.conn.query("select date,deaths as num from daily_record where country_name=\""+country_name+"\" order by date asc");
    rowData.forEach((item, i) => {
       total_deaths_timeline[item.date] = item.num;
    });
    var new_deaths_timeline = {};
    ret = this.generateIncreaseNum(rowData);
    for(var i = 0 ; i<ret.length;i++){
      var item = ret[i];
      var key = Object.keys(item);
      new_deaths_timeline[key[0]] = item[key[0]];
      if(i==ret.length-1){
          json['total_new_deaths_today'] = item[key[0]]
      }
    }
    console.log(country_name);
    var total_infected = this.conn.query("select date,cases as num from daily_record where country_name=\""+country_name+"\" order by date desc limit 1");
    var total_deaths = this.conn.query("select date,deaths as num from daily_record where country_name=\""+country_name+"\" order by date desc limit 1");
    var total_regions = [{'num':0}];
    var region_table_data = [];
    if(country_name=="global"){
        total_regions = this.conn.query("select count(distinct(country_name)) as num from daily_record");
        rowData = this.conn.query("select Max(date) as date, country_name, cases, deaths from daily_record group by country_name order by cases desc");
        rowData.forEach((item, i) => {
            var tmp = {};
            tmp['region']=item.country_name;
            tmp['Infecteds']=item.cases;
            tmp['deaths']=item.deaths;
            if(item.date == new_cases_lastDay.date){
              tmp['newcases']=new_cases_lastDay.num;
            }
            region_table_data.push(tmp);
        });
    }
    json['total_infected'] = total_infected[0]['num'];
    json['total_deaths'] = total_deaths[0]['num'];
    json['total_new_deaths_today'] =
    json['total_regions'] = total_regions[0]['num'];
    json['total_infected_timeline'] = total_infected_timeline;
    json['new_cases_timeline'] = new_cases_timeline;
    json['total_deaths_timeline'] = total_deaths_timeline;
    json['new_deaths_timeline'] = new_deaths_timeline;
    json['table_data'] = region_table_data;
    try {
      this.fileSystem.writeFileSync(fileName+'/sync.json', JSON.stringify(json), { mode: 0o755 });
    } catch(err) {
      // An error occurred
      console.error(err);
    }
    return json;
}

var test = new JsonGenerator();
test.global();
//test.generateJsonDataByCountry();
test.close();
