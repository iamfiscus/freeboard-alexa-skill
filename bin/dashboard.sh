#!/bin/(shell)
cp bin/dashboard.example.json dashboard.json

sed -i -e "s:IOT_TOPIC:${IOT_TOPIC}:g" dashboard.json
rm dashboard.json-e

sed -i -e "s:IOT_ENDPOINT:${IOT_ENDPOINT}:g" dashboard.json
rm dashboard.json-e

sed -i -e "s:IOT_REGION:${IOT_REGION}:g" dashboard.json
rm dashboard.json-e

sed -i -e "s:FREEBOARD_AWS_ACCESS_KEY:${FREEBOARD_AWS_ACCESS_KEY}:g" dashboard.json
rm dashboard.json-e

sed -i -e "s:FREEBOARD_AWS_SECRET_KEY:${FREEBOARD_AWS_SECRET_KEY}:g" dashboard.json
rm dashboard.json-e
