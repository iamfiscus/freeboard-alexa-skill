#!/bin/(shell)
LAMBDA_DIR=$(pwd)

echo "Creating lambda deployment package"

zip -r lambda.zip node_modules index.js package.json

echo "Deploying to AWS "
aws lambda create-function \
  --function-name 'freeboard-alexa-skill' \
  --runtime 'nodejs4.3' \
  --role $ROLE_ARN \
  --handler 'index.handler' \
  --description 'Alexa skill that publishes Freeboard data to AWS IoT Topics' \
  --environment "Variables={IOT_ENDPOINT=$IOT_ENDPOINT,IOT_TOPIC=$IOT_TOPIC,GOOGLE_MAPS_API=$GOOGLE_MAPS_API}" \
  --publish \
  --zip-file "fileb://$LAMBDA_DIR/lambda.zip"

rm lambda.zip

exit 0
