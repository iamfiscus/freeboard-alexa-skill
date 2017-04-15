#!/bin/(shell)
cp bin/dashboard.example.json dashboard.json

sed -i -e "s:IOT_TOPIC:${IOT_TOPIC}:g" bin/dashboard.example.json
rm dashboard.json-e

sed -i -e "s:IOT_ENDPOINT:${IOT_ENDPOINT}:g" bin/dashboard.example.json
rm dashboard.json-e

sed -i -e "s:IOT_TOPIC:${IOT_TOPIC}:g" bin/dashboard.example.json
rm dashboard.json-e
