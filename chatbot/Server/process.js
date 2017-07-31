var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ESClient = require('./connection.js')
var conf = require('./conf.js')

var QA = {
	      	processRequest:function (user,userQuestion,callback)
	      	{
	      		userQuestion = userQuestion.replace(/\n/g, '')
	      		userQuestion = userQuestion.toLowerCase();

	      		var data = {}
	      		searchAnswers(user, userQuestion, function(response)
	      		{
					noOfAnswers = response.hits.hits.length
					answers = []
					/*case 3: No match */
	      			if(noOfAnswers==0)
	      			{
	      				answers.push("I dont Know")
	      			}
	      			else
	      			{
	      				/*case 1: Direct match */
	      				source = response.hits.hits[0]['_source']
	      				firstQuestion = source['question']
	      				firstQuestion = firstQuestion.toLowerCase
	      				if(firstQuestion==userQuestion)
	      				{
	      					answers.push(source['answer'])
	      				}
	      				else
	      				{
	      					/*case 2: Indirect match i.e. match with main keyword*/
	      					response.hits.hits.forEach(function(hit)
	      					{
	      						answers.push(hit['_source']['answer'])
      						})
	      				}
	      			}
	      			data = JSON.stringify({'answer':answers})
	      			callback(data)
				})
	      		/* Return answers corresponding to asked question*/
	      		return data;
	     	 }
	 	 }

function searchAnswers(user,userQuestion,callback)
{
	var searchResponse ;
	ESClient.search({  
  	index: conf.ESIndex,
  	type: conf.ESType,
  	body: {
     		query: {
        	multi_match: {
           					query: userQuestion,
           					fields: ["question^10","tags^0.5"]
        				}
    				},
  			}
		},function (error, response,status) 
	{
    	if (error){
      		console.log("search error: "+error) }
    	else 
    	{
      		searchResponse = response;  
      		callback(searchResponse)
    	}

	});
	return searchResponse;
}



module.exports = QA; 