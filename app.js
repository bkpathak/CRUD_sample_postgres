
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');


var pg = require('pg');
var constr = "dbname=d2q8j53qt79pl6 host=ec2-107-22-190-179.compute-1.amazonaws.com user=ieprplhoammjmw password=BBoK8KdGdmN2w23hKn7CH3477W port=5432 sslmode=require";

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
	res.render("index");
});


function db_query(req, res, query, data){
	pg.connect(constr, function(err,client){
		if(err){
			console.log("Server connection failed!",err);
		}
		else {
			client.query(query, data, function(err, results){
				if(err){
					console.log("query err", err)
				}
				else {
					res.send(results);
					return;
				}				
			});
		}
		res.send({err:"failed"});
	});
}



app.post("/add_emp", function(req, res){
	var fname = req.body.fname;
	var lname = req.body.lname;
	var sdate = req.body.sdate;
	var age = req.body.age;
	
	//~ res.send({name:"welcome"});
	var qstr = "INSERT INTO employee (first_name, last_name, start_date, age) values ($1,$2,$3,$4)";
	db_query(req, res, qstr, [fname, lname, sdate, age]);
	
	
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
