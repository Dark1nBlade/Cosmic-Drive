import os
from cryptography.fernet import Fernet

# For demo purposes, we generate a key if not provided,
# but in prod it MUST be in environment variables.
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    ENCRYPTION_KEY = Fernet.generate_key().decode()

cipher_suite = Fernet(ENCRYPTION_KEY.encode())

def encrypt_value(value: str) -> str:
    if not value: return None
    return cipher_suite.encrypt(value.encode()).decode()

def decrypt_value(value: str) -> str:
    if not value: return None
    return cipher_suite.decrypt(value.encode()).decode()
