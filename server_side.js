const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
var url = require("url");

const api1 = require('./scripts/api1p.js');
const api2 = require('./scripts/api2p.js');
const api3 = require('./scripts/api3p.js');


app.set('view engine', 'hbs');

app.use("/views",express.static(__dirname + '/views'));
app.use("/scripts", express.static(__dirname + '/scripts'));


app.use(function(req, res, next) {
	const time = new Date().toString();
	const log1 = `${time}: ${req.method}: ${req.url} \n`;

	fs.appendFile('logs',log1, (err) => {
		if (err){
			console.log(err);
		}
		else{
			console.log('zapisano log');
		}
	});	
	next()
});


app.get('/', (req, res) => {
	res.render('client_side.hbs', {
		nowYear: new Date().getFullYear()
	});	
});

app.get('/szukaj', (req, res) => {
	var params = url.parse(req.url, true).query;
	console.log(params);

	var imie = params.Imię;
	console.log(imie);

	api1.getapi(app, imie).then( 
		(tab) => {
			console.log();		
			console.log('id: ' + tab[0]); 
			console.log();
			var id = tab[0];
			//label.textContent = 'id: ' + tab[0];

			api2.getapi(tab[0], tab[1]).then(
				(tab2) => { 
					var info2 = api2.api2info;
					//console.log();
					api3.getapi(tab2[0], tab2[1], tab2[2]).then( 
						() => {
							var info3 = api3.api3info;

							let name = info2.first_name + ' ';
							if (info2.middle_names != '')
								name += info2.middle_names + ' ';
							name +=  info2.last_name;

							let titles = 'titles: ';
							if (info2.titles.before != null)
								titles += info2.titles.before + ', ';
							if (info2.titles.after != null)
								titles += info2.titles.after;								

							let student_status = 'student status: ';
							switch(info2.student_status){
								case 0:
									student_status += 'The user is not, and never was, a student of this university.';
									break;
								case 1:
									student_status += 'The user was an active student in the past.';
									break;
								case 2:
									student_status += 'The user is an active student.';
									break;
								default:
									student_status += 'Cannot access student status of this user.';
									break;
							}							

							let student_prog = 'student programmes: ';
							if (info2.student_programmes.length > 0)
							{				
								for (let i=0; i<info2.student_programmes.length; i++){
									student_prog +=' id: ' + info2.student_programmes[0].id + ', ';
									student_prog +=' programme: ' + info2.student_programmes[0].programme.description.pl + '; ';
								}
							}

							let staff_stat = 'staff status: ';
							switch(info2.staff_status){
								case 1:			
									staff_stat += 'The user is an employed staff member, but he is not an academic teacher.';
									break;
								case 2:
									staff_stat += 'The user is an active academic teacher.';
									break;
							}
							
							let timetable = '';
							let thesis = '';
							if (info2.staff_status == 2)
							{
								if (info3.length > 0)
								{
									timetable ='timetable: ';
									for (let i=0; i<info3.length; i++){					
										timetable += ' ' + info3[i].name.pl + ': ';
										timetable += info3[i].start_time;
										timetable += ' - ' + info3[i].end_time + '; ';							
									}
								}
							}
							else
							{
								if (info3.authored_theses.length > 0)
								{
									thesis = 'authored theses: ';
									for (let i=0; i<info3.authored_theses.length; i++){
										thesis += ' id: ' + info3.authored_theses[i].id + ', ';
										thesis += ' type: ' + info3.authored_theses[i].type + ', ';
										thesis += ' title: ' + info3.authored_theses[i].title + '; ';
															
									}
								}	
							}

							res.render('szukaj.hbs', {
								id1: id,
								imie: name,
								titles: titles,
								student_status: student_status,
								student_prog: student_prog,
								staff_stat: staff_stat,								
								timetable: timetable,
								thesis: thesis,
								nowYear: new Date().getFullYear()
							});	
						}
						,
						(err) => {
							console.log('error3: '); 
							console.log(err.message);
						}
					);
					

				}
				,
				(err) => {
					console.log("error2: " + err.message);
				}
			);
		}
		,
		(err) => {
			console.log("error1: " + err.message);
		}
	);

	

});


//let port = 3000;
let server = app.listen(PORT, () => {
	console.log('server is running on port ' + PORT);// ${port}`);
});
