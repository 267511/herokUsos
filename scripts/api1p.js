const request = require('request');
//const express = require('express');
const opn = require('opn');


const CONSUMER_KEY = 'xm5skLwswr6jbyQUEmRZ';
const CONSUMER_SECRET = 'wbHgSszagj7DwdrybxUk9NR6AUxqdp6Kf6rWj28B';

//let app = express();

// step 1
var qs = require('querystring')
  , oauth =
    { callback: 'http://127.0.0.1:3000/callback'
    , consumer_key: CONSUMER_KEY
    , consumer_secret: CONSUMER_SECRET    
    }
  , url = 'https://usosapps.umk.pl/services/oauth/request_token'
  ;

var getapi = (appe, nazwisko) => {
return new Promise( (resolve, reject) => {
	request.post({url:url, oauth:oauth}, function (e, r, body) {	
		if(e) reject(e); 
		// step 2
		var req_data = qs.parse(body)
		var uri = 'https://usosapps.umk.pl/services/oauth/authorize'
			+ '?' + qs.stringify({oauth_token: req_data.oauth_token})

		console.log(uri);	
		opn(uri, {app: 'chrome'});

		appe.get('/callback', function (req, res) {
			// step 3
			// after the user is redirected back to your server
			res.send('Hello My USOS World');		
			let verifier = qs.parse(req.originalUrl).oauth_verifier
				, auth_data = qs.parse(body)
				, oauth =
					{ consumer_key: CONSUMER_KEY
					, consumer_secret: CONSUMER_SECRET
					, token: auth_data.oauth_token
					, token_secret: req_data.oauth_token_secret
					, verifier: verifier
					}
				, url = 'https://usosapps.umk.pl/services/oauth/access_token'
				;
	
			request.post({url:url, oauth:oauth}, function (e, r, body) {
				if(e) reject(e);
				// ready to make signed requests on behalf of the user
				var qs = require('querystring')
				var perm_data = qs.parse(body)
					, oauth =
						{ consumer_key: CONSUMER_KEY
						, consumer_secret: CONSUMER_SECRET
						, token: perm_data.oauth_token
						, token_secret: perm_data.oauth_token_secret
						}
					, url = 'https://usosapps.umk.pl/services/users/search2'
					, qs =
						{ 
						  lang: 'pl'
						, query: nazwisko
						, fields: 'items[user[id]]'
						}
					;

					request.get({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, body) {
						if(e) reject(e);
						if (body.items[0] != null)
						{
							let tab = [];
							tab.push(body.items[0].user.id);
							tab.push(oauth);
							resolve(tab);
							//resolve(body.items[0].user.id, oauth);
							
						}
							
						else
							reject(new Error('The user "' + nazwisko +'" was not found'));
					}) 
			}); //request.post
		}); //app.get('/callback', function (req, res)
	}); //request.post
}); //promise	
}; //getapi

module.exports.getapi = getapi;




