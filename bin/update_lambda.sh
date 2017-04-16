#!/bin/(shell)
LAMBDA_DIR=$(pwd)

echo "Creating lambda deployment package"

zip -r lambda.zip node_modules index.js package.json

echo "Deploying to AWS "
aws lambda update-function-code \
  --function-name 'freeboard-alexa-skill' \
  --publish \
  --zip-file "fileb://$LAMBDA_DIR/lambda.zip"

rm lambda.zip

exit 0
