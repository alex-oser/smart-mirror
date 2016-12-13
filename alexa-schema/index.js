var awsIot = require("aws-iot-device-sdk");
var deviceName = "test_cli";   //thing name from AWS IoT
var host = "a8rvv2jy0zsoi.iot.us-east-1.amazonaws.com"; //host address
var app_id = "amzn1.ask.skill.ab6400dc-f446-4e4d-b8bd-ad6d8e402a5d"; //app id from Alexa skill
/*
 thing shadow requires the private key, certificate and rooCA file you 
 downloaded at the time of certificate creation of AWS IoT
*/

var thingShadows = awsIot.thingShadow({
  keyPath: 'privkey.pem',
  certPath: 'cert.pem',
    caPath: 'aws-iot-rootCA.crt',
  clientId: deviceName,
    region: "us-east-1"
});
 
var ctx = null;

// Route the incoming request based on type (LaunchRequest, IntentRequest, etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        ctx = context;

        if (event.session.application.applicationId !== app_id) {
             ctx.fail("Invalid Application ID");
         }
 
        thingShadows.on('connect', function() {
			thingShadows.register('voice-chair');
 
		});
		
		thingShadows.on('message', function(topic, payload) {
            console.log('message', topic, payload.toString());
        });
     
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }
        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request, event.session);
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request, event.session);
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            ctx.succeed();
        }
    } catch (e) {
        console.log("EXCEPTION in handler:  " + e);
        ctx.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}


/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session ) {                  //, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
    intentName = intentRequest.intent.name;

    console.log("REQUEST to string =" + JSON.stringify(intentRequest));

    var callback = null;
    // Dispatch to your skill's intent handlers
    if ("TakePhoto" === intentName) {
        thingShadows.publish('Take photo', 'AWStest', function(){
			var cardTitle = "Take Photo";
			var sessionAttributes = {};
			var repromptText = "";
			var speechOutput = "Preparing to take a photo, please hold still.";
			var shouldEndSession = true;
			ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));
        });
    }else if ("SecurityModeOn" === intentName) {
        thingShadows.publish('Security On', 'AWStest', function(){
			var cardTitle = "Security On";
			var repromptText = "";
			var sessionAttributes = {};
			var speechOutput = "Entering security mode in ten seconds, please leave the room.";
			var shouldEndSession = true;
			ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));
    	});
    }else if ("SecurityModeOff" === intentName) {
		thingShadows.publish('Security Off', 'AWSTest', function(){
			var cardTitle = "Security Off";
			var repromptText = "";
			var sessionAttributes = {};
			var speechOutput = "Security mode disabled";
			var shouldEndSession = true;
			ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));
		});
	
    }else if ("AMAZON.HelpIntent" === intentName) {
        getHelp(callback);
    }else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    }else {
        throw "Invalid intent";
    }

}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse() {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to smart mirror home. I can take your photo and" + 
    "make your home more secure. Use the commands take a photo or enter security mode to continue";
    var repromptText = "I am ready for command.";
    var shouldEndSession = false;

    ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));

}

function getHelp() {
	var sessionAttributes = {};
    var cardTitle = "Help";
    var speechOutput = "I can take your photo and" + 
    "make your home more secure. Use the commands take a photo or enter security mode to continue";
    var repromptText = "Say take a photo or enter security mode";
    var shouldEndSession = false;

    ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));
}

function handleSessionEndRequest() {
	var sessionAttributes = {};
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for smart mirror home, have a nice day";
    var shouldEndSession = true;
	var repromptText = "";
    ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));
}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}
