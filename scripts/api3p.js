const request = require('request');

var getapi = (id, auth, which) => {
return new Promise( (resolve, reject) => {
	if (which == 2)
	{
		var qs = require('querystring')
		  , oauth = auth
		  , url = 'https://usosapps.umk.pl/services/tt/staff'
		  , qs =
			{ user_id: id
			, lang: 'pl'			
			}
		;

		request.get({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, body){
			if (e) reject(e);	
			if (body.length > 0)
			{
				console.log('timetable: ');
				for (let i=0; i<body.length; i++){					
					console.log(' ' + body[i].name.pl);
					console.log('  start: ' + body[i].start_time);
					console.log('  end  : ' + body[i].end_time);
					console.log();
				}
			}
			module.exports.api3info = body;	
			resolve();
		});
	}
	else
	{
		var qs = require('querystring')
		  , oauth = auth
		  , url = 'https://usosapps.umk.pl/services/theses/user'
		  , qs =
			{ user_id: id
			, lang: 'pl'
			, fields: 'authored_theses[id|type|title]'
			}
		;

		request.get({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, body){
			if (e) reject(e);	
			if (body.authored_theses.length > 0)
			{
				console.log('authored theses: ');
				for (let i=0; i<body.authored_theses.length; i++){
					console.log(' id: ' + body.authored_theses[i].id);
					console.log(' type: ' + body.authored_theses[i].type);
					console.log(' title: ' + body.authored_theses[i].title);
					console.log();					
				}
			}		
			module.exports.api3info = body;	
			resolve();
		});
	}
});//promise
};//getapi



module.exports.getapi = getapi;

