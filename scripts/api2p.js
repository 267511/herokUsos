const request = require('request');


var getapi = (id, auth) => {
return new Promise( (resolve, reject) => {
	var qs = require('querystring')
	  , oauth = auth
	  , url = 'https://usosapps.umk.pl/services/users/user'
	  , qs =
		{ user_id: id
		, lang: 'pl'
		, fields: 'first_name|middle_names|last_name|sex|titles|student_status|student_programmes'//|staff_status'
		}
	;

	request.get({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, body){		
		if (e) reject(e);	
		let name = body.first_name + ' ';
		if (body.middle_names != '')
			name += body.middle_names + ' ';
		name +=  body.last_name;
		console.log('name: ' + name);

		console.log('sex: ' + body.sex);	

		let titles = '';
		if (body.titles.before != null)
			titles += body.titles.before + ', ';
		if (body.titles.after != null)
			titles += body.titles.after;
		console.log('titles: ' + titles);	

		let student_status = '';
		switch(body.student_status){
			case 0:
				student_status = 'The user is not, and never was, a student of this university.';
				break;
			case 1:
				student_status = 'The user was an active student in the past.';
				break;
			case 2:
				student_status = 'The user is an active student.';
				break;
			default:
				student_status = 'Cannot access student status of this user.';
				break;
		}
		console.log('student status: ' + student_status);

		if (body.student_programmes.length > 0)
		{
			console.log('student programmes: ');
			for (let i=0; i<body.student_programmes.length; i++){
				console.log(' id: ' + body.student_programmes[0].id);
				console.log(' programme: ' + body.student_programmes[0].programme.description.pl);
			}
		}

		switch(body.staff_status){
			case 1:			
				console.log('staff status: The user is an employed staff member, but he is not an academic teacher.');
				break;
			case 2:
				console.log('staff status: The user is an active academic teacher.');
				break;
		}
		module.exports.api2info = body;

		let tab2 = [];
		tab2.push(id);
		tab2.push(auth);	
		tab2.push(body.staff_status);
		resolve(tab2);
		//resolve(id, auth, body.staff_status);
		//callback(e, id, auth, body.staff_status);
	});
});//promise
};//getapi

module.exports.getapi = getapi;

