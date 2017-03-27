# smart-mirror
A Raspberry Pi Smart Mirror project by Alexander Oser and Arivan Thillaikumaran

## The idea

Create an Amazon Alexa controlled smart mirror which knows current information about its environment and the world around it. The mirror will have access to the entire suite of Alexa skills allowing it to be easily integrated with many other IoT products currently on the market while simultaneously making it straightforward to add powerful and unique capabilities. 

## How it's made

**Hardware**
+ Computer monitor and speakers
+ Two-way mirror
+ Raspberry Pi + WiFi adaptor, camera, microphone, temperature/humidity monitor

**AWS Services**
+ Alexa Voice Services and Alexa Skills Kit
+ Lambda
+ S3
+ IOT

![alt text](https://github.com/alex-oser/smart-mirror/blob/master/assets/smartmirrorflow.png "Smart Mirror Flow Diagram")

## Webapge development

The webpage displaying information on the mirror is hosted on an AWS instance and retrieves information from various free APIs including weather data from http://api.openweathermap.org and news stories from https://reddit.com. In order to create the mirror effect, the page has a black background with white text displayed so that only the text is able to shine through the two-way mirror.

## Alexa Setup

Setting up Alexa on the Raspberry Pi was made possible through Amazon's Alexa Github tutorial which can be found [here](https://github.com/alexa/alexa-avs-sample-app/wiki/Raspberry-Pi).

Our Alexa skill is based on another template from Amazon which can be found [here](https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/reindeerGames).

## Lambda Functions:

**security_mode_lambda** is the lambda function that is triggered when a photo is uploaded to an S3 bucket while "security mode" is active, comparing that photo to the most recently taken photo (stored in another S3 bucket,) and sending the photo to the user via Twilio if motion is detected.

**take_pic_lambda** is the lambda function that is triggered when a photo is uploaded to an S3 bucket when the "take a picture" command is given to the mirror, sending the photo to the user via Twilio. 

## Latency Analysis

One of the primary purposes of this project was to analyze the current state of IoT technolgy by performing latency analysis on AWS services and the complex system needed for this project provided the perfect testing ground. The results of the analysis can be found [here](https://github.com/alex-oser/smart-mirror/blob/master/LatencyAnalysisReport.pdf).
