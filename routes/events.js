const express = require('express');
const router =  express.Router();

//Bring in models
let dbvariable = require('../models/users');
let eventVariable = require('../models/events');
let contactVariable = require('../models/contacts')

//users Events
//add routes for creating events
router.get('/CreateEvent', function(req, res){
	res.render('events',{
		title:'Events'
	});
});

//Get Single Event
router.get('/:id', function(req, res){
	eventVariable.findById(req.params.id, function(err, events){
		res.render('single_event',{
			events: events
		});
	});
});
//for checking if events are created in database or not route
router.get('/', function(req, res){
	eventVariable.find({}, function(err, events){
		if(err){
			console.log(err);
		}
		else{
			res.render('eventList',{
				title:'All Events',
				events: events
			});
		}
	});
});

//add event creation and submission route
router.post('/CreateEvent', function(req, res){
	console.log('submitted');
	let x= new eventVariable();
	x.event_name=req.body.event_name;
	x.event_body=req.body.event_body;
	x.event_UserName = req.user.name; 	//to show who has posted the event

	x.save(function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/');
		}
	});

	return;
});


//Edit Event
router.get('/edit/:id', function(req, res){
	eventVariable.findById(req.params.id, function(err, events){
		res.render('edit_event',{
			events: events

		});
	});

});

//update event submission route
router.post('/edit/:id', function(req, res){
	let x= {};
	x.event_name=req.body.event_name;
	x.event_body=req.body.event_body;

	//console.log(req.body.event_name);

	let query = {_id:req.params.id}
	eventVariable.update(query, x, function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/');
		}
	});

	return;
	console.log('updated');
});

router.delete('/:id', function(req, res){
	let query = {_id:req.params.id}
	eventVariable.remove(query, function(err){
		if(err){
			console.log(err);
		}
		res.send('success');
	});
});

module.exports = router;
