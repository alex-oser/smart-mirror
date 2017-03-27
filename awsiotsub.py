#!/usr/bin/python

# this source is part of my Hackster.io project:  https://www.hackster.io/mariocannistra/radio-astronomy-with-rtl-sdr-raspberrypi-and-amazon-$

# use this program to test the AWS IoT certificates received by the author
# to participate to the spectrogram sharing initiative on AWS cloud

# this program will subscribe and show all the messages sent by its companion
# awsiotpub.py using the AWS IoT hub

import paho.mqtt.client as paho
import os
import socket
import ssl
import time
import boto
import sys
AWS_ACCESS_KEY_ID = ''
AWS_SECRET_ACCESS_KEY = ''

bucket_name = 'arivanoserbucket'
conn = boto.connect_s3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
bucket = conn.get_bucket(bucket_name)

from boto.s3.key import Key

def on_connect(client, userdata, flags, rc):
    print("Connection returned result: " + str(rc) )
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("Take photo") #" , 1 )
    client.subscribe("Security On")

def on_message(client, userdata, msg):
    print("received a message")
    print(msg.topic)
    if msg.topic == "Take photo":
        print("Taking photo")
        os.system("raspistill -o /home/pi/images/image.jpg -q 5")
	print 'Uploading'
	selfie_bucket = conn.get_bucket('arivanosersourcebucket')
	k = Key(selfie_bucket)
	k.key = "image.jpg"
	k.set_metadata('Content-Type', 'image/jpeg')
	k.set_contents_from_filename('/home/pi/images/image.jpg')
	#os.system("aws s3api put-object --bucket arivanoserbucket --key image.png --body /home/pi/images/image.png")
#	os.system("rm /home/pi/images/image.jpg")
    elif msg.topic == "Security On":
        print("Activating security mode")
	security_mode = open('security_mode.txt', 'r+')
	security_mode.write('true')
	security_mode.close()
	is_on = 'true'
        while 'true' in is_on:
            os.system("raspistill -o /home/pi/images/image.jpg -q 20 -t 1 -n -rot 270")
	    print 'Taking a security photo'
            k = Key(bucket)
            k.key = "image.jpg"
            k.set_metadata('Content-Type', 'image/jpeg')
            k.set_contents_from_filename('/home/pi/images/image.jpg')
            os.system("rm /home/pi/images/image.jpg")
            security_mode = open('security_mode.txt', 'r')
	    is_on = security_mode.readline()
	    print(is_on)
	    security_mode.close()
 	    time.sleep(60)

    print("topic: "+msg.topic)
    print("payload: "+str(msg.payload))

#def on_log(client, userdata, level, msg):
#    print(msg.topic+" "+str(msg.payload))

mqttc = paho.Client()
mqttc.on_connect = on_connect
mqttc.on_message = on_message
#mqttc.on_log = on_log

awshost = "data.iot.us-east-1.amazonaws.com"
awsport = 8883
clientId = "test_cli"
thingName = "test_cli"
caPath = "aws-iot-rootCA.crt"
certPath = "cert.pem"
keyPath = "privkey.pem"

mqttc.tls_set(caPath, certfile=certPath, keyfile=keyPath, cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)

mqttc.connect(awshost, awsport, keepalive=60)

mqttc.loop_forever()
