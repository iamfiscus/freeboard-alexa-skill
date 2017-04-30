# Install

## Setup Example
- Clone or download this repository
- Generate .env file

``` shell
npm run env
```

The command creates your environment variable file which can be used to customize the example.

## Setup AWS IoT

The purpose of this step is to create an AWS IoT endpoint which all [Freeboard](https://github.com/Freeboard/freeboard) data sources use via a publish/subscribe model.

### Create Thing
- Log in to the AWS Console
- Navigate to AWS IoT
- Select: Registry > Things > Create

![Create Thing](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step1/create-thing.png "Create Thing")

### Register Thing

![Register Thing](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step1/register-thing.png "Register Thing")

### Add IoT Endpoint to ENV
![IoT Endpoint](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step1/thing-success.png "IoT Endpoint")

Add your IoT Endpoint under HTTPS to `./.env`
```
IOT_ENDPOINT=${IOT_ENDPOINT}
```

###### Optional
All the variables below have default values. However, you can also change them if you'd like. Make sure there is no trailing slash on your Topic.
- IoT Topic: the base part of the publish/subscribe model which [Freeboard](https://github.com/Freeboard/freeboard) uses to communicate through it's data source.
- Giphy API: There is a voice command which gets an image from Giphy.

```
IOT_TOPIC=${IOT_TOPIC || 'freeboard/alexa'}
GIPHY_API=${GIPHY_API || 'dc6zaTOxFJmzC'}
```

## Setup Google Maps API

In the [Freeboard](https://github.com/Freeboard/freeboard) dashboard, there is a panel which has a  command that allows you to place a marker on a map by saying an address. The Lambda function uses the address as well as the Google Maps API to provide the Latitude and Longitude, which is needed for the maps panel.

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

You must create or use an AWS role which will allow permissions to execute the function and publish IoT data.

- Login to AWS Console
- Navigate to IAM
- Create new role with the following permissions
  -**These are not secure for production**

![Create Role](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step3/lambda-executor-policy.png "Create Role")

### Configure Environment Variables

The last mandatory environment variable you need before creating the Lambda function is your IAM Role ARN which is necessary when using the AWS CLI.

![Role ARN](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step3/lambda-executor-arn.png "Role ARN")

Add your Lambda Executor ARN to `./.env`
```
ROLE_ARN=${ROLE_ARN}
```
### Create Lambda Function
There is an NPM script to automate the creation of the Lambda function.  It executes a [bash script](https://github.com/iamfiscus/freeboard-alexa-skill/master/bin/create.sh) which performs the necessary steps to create a function with the AWS CLI.

The script does the following things:
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
A successful Lambda function will look similar to this in an AWS Console.

![Lambda Function](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step3/lambda-function.png "Lambda Function")

### Add Alexa Trigger
There is one manual configuration you can not do with the AWS CLI, which is adding Alexa as the "Trigger" to your Lambda function. This trigger will allow Alexa to execute the function when accessed by certain voice commands.
- Login to AWS Console
- Navigate to AWS Lambda
- Select 'Trigger' tab
- Add Trigger

![Alexa Trigger](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step3/lambda-function-trigger.png "Alexa Trigger")

## Setup Alexa Skill

Next, we need to setup a custom Alexa skill for the voice commands.

### Create Alexa Skill
- Login to AWS [Alexa Developer](https://developer.amazon.com/edw/home.html#/) portal
- Navigate to Alexa tab

![Create Alexa Skill](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/create-alexa-skill.png "Create Alexa Skill")

### Configure Skill
The most important thing to note on this step in the invocation name, which is what Alexa uses to recognize the voice command. In our case "free board" will be used.

![Configure Skill](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-alexa-skill.png "Configure Skill")

### Configure Intents
Intents are like method handlers when the Lambda function executes it has the parameters event and context which provide information on what method to call. Our "Hello World" example is [MessageIntent](https://github.com/iamfiscus/freeboard-alexa-skill/blob/master/index.js#L106).

Inside the intent are slots which are very similar to variables you need to define name and type. There are Amazon built in slots, and custom slots which we will go over next.

**There is a GUI skill builder beta version, which looks different**

![Configure Intents](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-intents.png "Configure Intents")

### Configure Custom Slots

Here is where you create your custom slots values.

LIST_OF_WORDS:
```
good morning
line
tea
promises
my phone number is 12345
```

ON_OFF:
```
on
off
```

![Configure Custom Slots](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-custom-slots.png "Configure Custom Slots")

**There is a GUI skill builder beta version, which looks different**

### Configure Sample Utterances
Below are the phrases which Alexa will recognize to execute intents.
Add these as your sample utterances.
```
GaugeIntent set gauge to {Gauge}
GaugeIntent set gauge at {Gauge}
ImageIntent find image of {Image}
ImageIntent search image of {Image}
ImageIntent find meme of {Image}
ImageIntent search meme of {Image}
IndicatorIntent label indicator on at {IndicatorOn}
IndicatorIntent label indicator off at {IndicatorOff}
IndicatorIntent label indicator on to {IndicatorOn}
IndicatorIntent label indicator off to {IndicatorOff}
IndicatorIntent turn indicator {Indicator}
MapIntent place address at {Address}
MapIntent place map at {Address}
MapIntent set address at {Address}
MapIntent set map at {Address}
MapIntent set address to {Address}
MapIntent set map to {Address}
MessageIntent create message {Message}
MessageIntent send message {Message}
MessageIntent send text message {Message}
PointerIntent set pointer name to {Name}
PointerIntent set pointer to {Pointer}
PointerIntent set pointer at {Pointer}
```

![Configure Sample Utterances](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-utterances.png "Configure Sample Utterances")

**There is a GUI skill builder beta version, which looks different**

### Configure Lambda Function
At this point you need to configure your Alexa Skill to trigger the Lambda function. Locate the ARN of your Lambda function and save it in the Alexa developer portal.

![Locate Lambda ARN](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/lambda-arn.png "Locate Lambda ARN")


![Configure Lambda](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/configure-lambda.png "Configure Lambda")

## Setup Freeboard

Lastly, we need to setup [Freeboard](https://github.com/Freeboard/freeboard) which is an open source dashboard for IoT.

### Download
Clone or download [Freeboard](https://github.com/Freeboard/freeboard#how-to-use)

### Install AWS IoT Plugin
Change to the directory freeboard and install the plugin. [Plugin Documentation](https://github.com/iamfiscus/freeboard-aws-iot-ws-mqtt#install)
```
npm install -S freeboard-aws-iot-ws-mqtt
```
Modify the [index.html](https://github.com/iamfiscus/freeboard-aws-iot-ws-mqtt#html)

Launch Freeboard
```
grunt
```

### Create Dashboard

There is an example dashboard which can be created to interact with the Alexa Skill. You must add your AWS credentials to your `./.env`. Then run the NPM script which executes a [bash script](https://github.com/iamfiscus/freeboard-alexa-skill/master/bin/dashboard.sh) to generate the example dashboard.**Make sure you are in the Freeboard Alexa Skill folder**

```shell
npm run dashboard
```

### Load Dashboard

In order to generate the datasource and panels you need to load the `dashboard.json`.

![Dashboard Init](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/dashboard-init.png "Dashboard Init")

The `dashboard.json` creates the panels and datasource configuration.

![Dashboard Loaded](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/dashboard-load.png "Dashboard Loaded")

![Data Source](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/datasource.png "Data Source")

## Test

Let's test!!!

![Enable Skill](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/enable-skill.png "Enable Skill")

Command Examples:
```
text message {Message}
set gauge at {Gauge}
turn indicator {Indicator}
set pointer to {Pointer}
get image of {Image}
place map at {Address}
```

![Test](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/step4/test.png "Test")

## Result

![Result](https://github.com/iamfiscus/freeboard-alexa-skill/raw/master/docs/images/result.png "Result")
