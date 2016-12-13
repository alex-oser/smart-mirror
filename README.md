# smart-mirror
A Raspberry Pi Smart Mirror project by Alexander Oser and Arivan Thillaikumaran

### Alexa Setup
Setting up Alexa on the Raspberry Pi was made possible through Amazon's Alexa Github tutorial which can be found [here](https://github.com/alexa/alexa-avs-sample-app/wiki/Raspberry-Pi)

Our Alexa skill is based on another template from Amazon which can be found [here](https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/reindeerGames)

#### Lambda Functions:

security_mode_lambda is the zip file that one must upload to the "create Lambda Function" console in order to create that Lambda Function. The zip file contains all the python libraries needed for lambda_function.py (inside security_mode_lambda.zip) to be run. It is the lambda function that is triggered when a photo is uploaded to an S3 bucket during "security mode", comparing that photo to the most recently taken photo (stored in another S3 bucket,) and sending the photo to the user via Twilio if motion is detected.

take_pic_lambda is the zip file that one must upload to the "create Lambda Function" console in order to create that Lambda Function. The zip file contains all the python libraries needed for lambda_function.py (inside take_pic_lambda.zip) to be run. It is the lambda function that is triggered when a photo is uploaded to an S3 bucket when the "take a picture" command is given to the mirror, sending the photo to the user via Twilio. 
