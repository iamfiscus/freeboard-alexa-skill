```
{
  "intents": [
    {
      "slots": [
        {
          "name": "Message",
          "type": "LIST_OF_WORDS"
        }
      ],
      "intent": "MessageIntent"
    },
    {
      "slots": [
        {
          "name": "Image",
          "type": "LIST_OF_WORDS"
        }
      ],
      "intent": "ImageIntent"
    },
    {
      "slots": [
        {
          "name": "Gauge",
          "type": "AMAZON.NUMBER"
        }
      ],
      "intent": "GaugeIntent"
    },
    {
      "slots": [
        {
          "name": "Pointer",
          "type": "AMAZON.NUMBER"
        },
        {
          "name": "Name",
          "type": "LIST_OF_WORDS"
        }
      ],
      "intent": "PointerIntent"
    },
    {
      "slots": [
        {
          "name": "Address",
          "type": "AMAZON.PostalAddress"
        }
      ],
      "intent": "MapIntent"
    },
    {
      "slots": [
        {
          "name": "IndicatorOn",
          "type": "LIST_OF_WORDS"
        },
        {
          "name": "IndicatorOff",
          "type": "LIST_OF_WORDS"
        },
        {
          "name": "Indicator",
          "type": "ON_OFF"
        }
      ],
      "intent": "IndicatorIntent"
    },
    {
      "intent": "ExitApp"
    }
  ]
}
```
MessageIntent send {Message}
GaugeIntent set gauge at {Gauge}
IndicatorIntent set indicator on at {IndicatorOn}
IndicatorIntent set indicator off at {IndicatorOff}
IndicatorIntent turn indicator {Indicator}
ExitApp stop
