import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER')

client = None
if account_sid and auth_token:
    client = Client(account_sid, auth_token)

def send_sms(to_phone_number: str, message_body: str):
    if not client:
        print("Twilio credentials not found. Mocking SMS send.")
        print(f"To: {to_phone_number}, Message: {message_body}")
        return True

    try:
        # Twilio requires phone numbers to be in E.164 format (e.g., +84...)
        # Assuming input is like 0912345678, we need to convert to +84912345678
        formatted_phone = to_phone_number
        if to_phone_number.startswith('0'):
            formatted_phone = '+84' + to_phone_number[1:]
        
        message = client.messages.create(
            body=message_body,
            from_=twilio_phone_number,
            to=formatted_phone
        )
        print(f"SMS sent: {message.sid}")
        return True
    except Exception as e:
        print(f"Failed to send SMS: {e}")
        return False
