import botocore
import boto.s3
from twilio.rest import TwilioRestClient
from twilio.exceptions import TwilioException

phonebucket = "arivanosersourcebucket"
account_sid = ""
auth_token = ""
client = TwilioRestClient(account_sid, auth_token)
def lambda_handler(event, context):
    for record in event['Records']:
        conn = boto.s3.connect_to_region('us-east-1')
        bucket = conn.get_bucket(phonebucket)
        key = record['s3']['object']['key']
        target = bucket.lookup(image1key)
        target.set_acl('public-read')

        try:
            client.messages.create(from_="CLIENT_PHONE", to="RECIPIENT_PHONE", body="Intruder Detected", media_url="https://s3.amazonaws.com/arivanosersourcebucket/image.png")
        except TwilioException as e:
            raise MotionAlertError("Error sending MMS with Twilio: ""{0}".format(e))

