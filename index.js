/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample interfaces with AWS IoT and the Freeboard.io IoT Dashboard
 **/

'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
const iotData = new AWS.IotData({
    endpoint: process.env.IOT_ENDPOINT
});
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GOOGLE_MAPS_API,
    formatter: 'json'
});
const giphy = require('giphy-api')(process.env.GIPHY_API); // dc6zaTOxFJmzC

const APP_ID = process.env.APP_ID;

const publish = function(topic, payload, callback) {
    const params = {
        "topic": process.env.IOT_TOPIC + '/' + topic,
        "payload": JSON.stringify(payload)
    };
    const response = {
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

const mapLatLong = function(address, callback) {
    geocoder.geocode(address)
        .then(function(res) {
            console.log('Map Data:', res);

            const payload = {
                map: {
                    latitude: res[0].latitude,
                    longitude: res[0].longitude
                }
            };

            publish('map', payload, result => {
                callback(result);
            });
        })
        .catch(function(err) {
            callback({
                type: 'map',
                message: 'ERROR_MESSAGE'
            });
        });
}

const giphyImage = function(search, callback) {
    console.log('Image processing', search);

    giphy.random({
        tag: search,
        fmt: 'json'
    }).then(function(res) {
        console.log('Giphy data', res);
        const payload = {
            image: {
                value: res.data.image_url
            }
        };

        publish('image', payload, result => {
            callback(result);
        });
    }).catch(function(err) {
        callback({
            type: 'ERROR_MESSAGE',
            message: 'image'
        })
    });
}

const handlers = {
    'LaunchRequest': function() {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");

        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
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
    'PointerIntent': function() {
        const payload = {
            pointer: {
                value: this.event.request.intent.slots.Pointer.value
            }
        };

        if (this.event.request.intent.slots.Name.value) {
            payload.pointer.name = this.event.request.intent.slots.Name.value;
        } else {
            payload.pointer.name = 'Pointer';
        }
        console.log(payload);

        publish('pointer', payload, result => {

            this.emit(':tell', this.t(result.type, result.message));

        });
    },
    'ImageIntent': function() {
        console.log('Image called with: ', this.event.request.intent);

        giphyImage(this.event.request.intent.slots.Image.value, result => {
            console.log('IoT Publish Response', result);
            this.emit(':tell', this.t(result.type, result.message));

        });
    },
    'MapIntent': function() {
        console.log('Map called with: ', this.event.request.intent);

        mapLatLong(this.event.request.intent.slots.Address.value, result => {
            this.emit(':tell', this.t(result.type, result.message));
        });
    },
    'IndicatorIntent': function() {
        const payload = {
            indicator: {}
        };

        if (this.event.request.intent.slots.IndicatorOn.value) {
            payload.indicator.on = this.event.request.intent.slots.IndicatorOn.value;
        } else {
            payload.indicator.on = 'On';
        }

        if (this.event.request.intent.slots.IndicatorOff.value) {
            payload.indicator.off = this.event.request.intent.slots.IndicatorOff.value;
        } else {
            payload.indicator.off = 'Off';
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
    'Unhandled': function() {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Freeboard Alexa and AWS Internet of Things Example',
            WELCOME_MESSAGE: "Welcome to %s. You can send data to free board like, send text message hello world ... Now, what can I help you with.",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the recipe, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what\'s the recipe, or you can say exit...Now, what can I help you with?",
            SUCCESS_MESSAGE: '%s was successfully sent to Freeboard.',
            ERROR_MESSAGE: 'There was a problem sending you request.',
            STOP_MESSAGE: 'Goodbye!'
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
