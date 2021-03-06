
'use strict';

var mongoose = require('mongoose')
, _ = require('underscore')
, Schema = mongoose.Schema;

var userSchema 				= require('./user');
var clientSchema 			= require('./client');

var visitSchema = new mongoose.Schema({

	title						    : { type: String, trim: true },
	client 						    : { type: Schema.Types.ObjectId, ref: 'clients' },//{ type: String },
	agenda							: { type: String, trim: true },
	startDate						: { type: Date},//, default: Date.now },
	endDate							: { type: Date},//, default: Date.now },
	locations						: { type: String, trim: true },  // set of csc locations
	agm								: { type: Schema.Types.ObjectId, ref: 'User'},
	anchor							: { type: Schema.Types.ObjectId, ref: 'User'},
	secondaryVmanager				: { type: Schema.Types.ObjectId, ref: 'User'},
	schedule						: [{
		startDate					: { type: Date},
		endDate						: { type: Date},
		location					: { type: String },  // set of csc locations
		meetingPlace				: { type: String, trim: true }

	}],
	bod								: [{
		tcv							: {type: String, trim: true },
		duration					: {type: String, trim: true },
		offerings					: {type: String, trim: true },
		teamSize					: {type: String, trim: true }
	}],
	billable						: { type: String, lowercase: true, trim: true, enum: ['billable', 'non-billable']},
	competitorVisit					: { type: String, trim: true },
	wbsCode							: { type: String, trim: true },
	chargeCode						: { type: String, trim: true },
	visitors						: [{
		visitor						: { type: Schema.Types.ObjectId, ref: 'User' },
		influence					: { type: String, lowercase: true, trim: true },		// {Decision Maker, Influencer, End User, Others}
		welcomeStatus     			: { type: String, default: 'notshown'}
	}],
	interest						: {
		businessType			    : { type: String, lowercase: true, trim: true },		// {new, repeat}
		visitType					: { type: String, lowercase: true, trim: true },		// {new, repeat}
		objective					: { type: String, trim: true }
	},
	status							: { type: String, lowercase: true, trim: true },		// {confirmed, tentative, freeze, done}
	createBy						: { type: Schema.Types.ObjectId, ref: 'User'},
	createOn						: { type: Date, default: Date.now },
	feedbackTmpl				    : { type: Schema.Types.ObjectId, ref: 'feedbackDefs' },
	sessionTmpl				    	: { type: Schema.Types.ObjectId, ref: 'feedbackDefs' },
	keynote						: [{
		note   						: { type: Schema.Types.ObjectId, ref: 'keynotes' },
		context 					: {type: String, enum: ['welcome', 'thankyou'], trim: true},
		order						: {type: Number, required: false}
	}],
	invitees						: [{type: Schema.Types.ObjectId, ref: 'User'}],
	wbscodeAttachment				: { type: String},
	visitAttachment				: [{ type: String }],
	summary						: { type: String, lowercase: true, trim: true },
	actionItem						: { type: String, lowercase: true, trim: true },
	visitGallery					: [{ type: String }],
	// vertical						: { type: String, trim: true, required: true },
	offerings 						: [{ type: String, trim: true }],
	cscPersonnel					: {
		salesExec					: { type: Schema.Types.ObjectId, ref: 'User'},
		accountGM					: { type: Schema.Types.ObjectId, ref: 'User'},
		industryExec				: { type: Schema.Types.ObjectId, ref: 'User' },
		globalDelivery				: { type: Schema.Types.ObjectId, ref: 'User'},
		cre 						: { type: Schema.Types.ObjectId, ref: 'User'},
	},
	competitors 					: [{ type: String, trim: true }],
	netPromoter						: { type: String, trim: true },
	visitorType						: { type: String, trim: true },
	comments						: [{type: Schema.Types.ObjectId, ref: 'comments'}],
	overallfeedback				:[{
		id                          : { type: Schema.Types.ObjectId, ref: 'User'},
		role						: { type: String, trim: true },
		feedbackElg					: { type: String, trim: true }
	}],
	rejectReason 					: { type: String, trim: true },
	cancelReason					: { type: String, trim: true },
	preview                         : { type: String, trim: true, enum: ['good', 'poor']},
	visitFlagNumber					: { type:Number , default:0}
});

visitSchema.post('init', function(doc) {
	if(doc.schedule.length<=0)
		return; 
	
	var schedules =  _.sortBy( doc.schedule, 'startDate' );
	var startDate = schedules[0].startDate;
	var endDate = schedules[schedules.length-1].endDate;
	var locations = "";

	schedules.forEach(function(sch){
		if(locations === "")
			locations = sch.location;
		else
			locations = locations + ", " + sch.location;
	})

	// add temporary variable to be added to doc
	doc.set( "locations", locations, { strict: false });
	doc.set( "startDate", startDate, { strict: false });
	doc.set( "endDate", endDate, { strict: false });
});

module.exports = mongoose.model('visits', visitSchema);