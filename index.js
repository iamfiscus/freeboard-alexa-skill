/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
const iotData = new AWS.IotData({
    endpoint: process.env.IOT_ENDPOINT
});

const APP_ID = process.env.APP_ID; // TODO replace with your app ID (OPTIONAL).

const publish = function(topic, payload, callback) {
		let params = {
        "topic": process.env.IOT_TOPIC + '/' + topic,
        "payload": JSON.stringify(payload)
    };
    let response = {
      type: 'SUCCESS_MESSAGE',
      message: topic
    }

    iotData.publish(params, function(err, data) {
        console.log('testing')
        if (err) {
            console.log(err.stack, data);
            response.type = 'ERROR_MESSAGE';
            callback(response);
        } else {
            console.log('IoT', data)
            callback(response);
        }
    });
}

const handlers = {
    'MessageIntent': function() {
        const payload = {
            message: this.event.request.intent.slots.Message.value
        };
        console.log(payload);

        publish('text', payload, result => {

          this.emit(':tell', this.t(result.type, result.message));

        });
    },
    'GaugeIntent': function() {
        const payload = {
            gauge: {
              value: this.event.request.intent.slots.Gauge.value
            }
        };
        console.log(payload);

        publish('gauge', payload, result => {

          this.emit(':tell', this.t(result.type, result.message));

        });
    },
    'IndicatorIntent': function() {
        const payload = {
            indicator: {}
        };

        if (this.event.request.intent.slots.IndicatorOn.value) {
          payload.indicator.on = this.event.request.intent.slots.IndicatorOn.value;
        }

        if (this.event.request.intent.slots.IndicatorOff.value) {
          payload.indicator.off = this.event.request.intent.slots.IndicatorOff.value;
        }

        console.log('value', this.event.request.intent.slots.Indicator.value, this.event.request.intent.slots.Indicator.value === 'on');
        if (this.event.request.intent.slots.Indicator.value && this.event.request.intent.slots.Indicator.value === 'on') {
          payload.indicator.value = 1;
        } else {
          payload.indicator.value = 0;
        }

        console.log('payload', payload);

        publish('indicator', payload, result => {

          this.emit(':tell', this.t(result.type, result.message));

        });
    },
    'AMAZON.HelpIntent': function() {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function() {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function() {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function() {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function() {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'American Minecraft Helper',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the recipe for a chest? ... Now, what can I help you with.",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the recipe, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what\'s the recipe, or you can say exit...Now, what can I help you with?",
            SUCCESS_MESSAGE: '%s was successfully sent to Freeboard.',
            STOP_MESSAGE: 'Goodbye!',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the recipe for %s. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that recipe. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
