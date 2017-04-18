# Install

## Setup Example
- Clone or download this repository
- Generate .env file

``` shell
npm run env
```

This will create you environment variable file.

## Setup AWS IoT

This is to create an AWS IoT endpoint which all Freeboard data sources use via a publish/subscribe model.

### Create Thing
- Login to the AWS Console
- Navigate to AWS IoT
- Select: Registry > Things > Create

![Create Thing](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step1/create-thing.png "Create Thing")

### Register Thing

![Register Thing](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step1/create-thing.png "Register Thing")

### Add IoT Endpoint to ENV
![IoT Endpoint](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step1/thing-success.png "IoT Endpoint")

Add your IoT Endpoint under HTTPS to `./.env`
```
IOT_ENDPOINT=${IOT_ENDPOINT}
```

###### Optional
All the variables below have default values. However you can also change them if you'd like. Make sure there is no trailing slash on your Topic.
- IoT Topic: the base part of the topic which freeboard sends data through.
- Giphy API: There is a voice command which gets an image from Giphy.

```
IOT_TOPIC=${IOT_TOPIC || 'freeboard/alexa'}
GIPHY_API=${GIPHY_API || 'dc6zaTOxFJmzC'}
```

## Setup Google Maps API

This is for the command that allows you to place a marker on a map by Latitude and Longitude.

### Create API Key
[Get Google Maps API](https://developers.google.com/maps/documentation/javascript/get-api-key)

### Add Google Maps API to ENV

![Google Maps API](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step2/google-maps-api-key.png "Google Maps API")

Add your Google Maps API Key to `./.env`
```
GOOGLE_MAPS_API=${GOOGLE_MAPS_API}
```

## Setup Lambda Function

### Create Role

This is the AWS role which wil

- Login to AWS Console
- Navigate to IAM
- Create new role with the following permissions
  - ** These are not secure for production **

![Create Role](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step3/lambda-executor-policy.png "Create Role")

### Configure Environment Variables

The last mandatory environment variable is your IAM Role ARN. This is for creating the Lambda function.

![Role ARN](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step3/lambda-executor-arn.png "Role ARN")

Add your Lambda Executor ARN to `./.env`
```
ROLE_ARN=${ROLE_ARN}
```
### Create Lambda Function
There is an NPM script to automate creation of the Lambda function. The script does the following things:
- Package everything for deployment
 - index.js
 - node_modules
 - package.json
 - .env
- Create function
  - Upload .zip file
  - Variables assigned

```
npm run create
```

###### Optional
A successful Lambda function will look similar to this in a AWS Console.

![Lambda Function](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step3/lambda-function.png "Lambda Function")

### Add Alexa Trigger
- Login to AWS Console
- Navigate to AWS Lambda
- Select 'Trigger' tab
- Add Trigger

![Alexa Trigger](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step3/lambda-function-trigger.png "Alexa Trigger")

## Setup Alexa Skill

Next we need to setup a custom Alexa skill for the voice commands.

### Create Alexa Skill
- Login to AWS [Alexa Developer](https://developer.amazon.com/edw/home.html#/) portal
- Navigate to Alexa tab

![Create Alexa Skill](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/create-alexa-skill.png "Create Alexa Skill")

### Configure Skill

![Configure Skill](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-alexa-skill.png "Configure Skill")

### Configure Intent

![Configure Intent](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-intent.png "Configure Intent")

### Configure Sample Utterances

![Configure Sample Utterances](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-utterances.png "Configure Sample Utterances")

### Configure Custom Slots

![Configure Custom Slots](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-custom-slots.png "Configure Custom Slots")

### Configure Lambda Function

![Configure Lambda](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-lambda.png "Configure Lambda")
