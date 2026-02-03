from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from core.engine import *
from core.model import *

router = APIRouter()
