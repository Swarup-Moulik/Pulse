import os
from datetime import datetime, timedelta

import jwt
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load the variables from the .env file
load_dotenv()

# BULLETPROOF FALLBACKS: If os.getenv is None or empty, it forces the string on the right.
SECRET_KEY = os.getenv("SECRET_KEY") or "fallback-super-secret-pulse-key-for-local-dev"
ALGORITHM = os.getenv("ALGORITHM") or "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or "1440")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hashes a raw password."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a raw password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    """Generates a JWT for the user."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    # This will now 100% work because SECRET_KEY is guaranteed to be a string
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
