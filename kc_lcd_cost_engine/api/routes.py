from fastapi import APIRouter
from api.schemas import CostRequest
from core.model import *
from core.engine import *

router = APIRouter()

@router.post("/lcd-module/cost-eval")
def evaluate_cost(req: CostRequest):

    cog = COGParams(**req.cog.dict())
    blu = BLUParams(**req.blu.dict())
    pcba = PCBAParams(**req.pcba.dict())
    asm = AssemblyParams(**req.assembly.dict())
    labor = LaborParams(**req.labor.dict())

    total_cost = calc_total_cost(cog, blu, pcba, asm, labor)

    return {
        "mode": "LCD_MODULE",
        "engine_version": "v1.0",
        "engineering_total_cost": round(total_cost, 2),
        "note": "Engineering-derived cost. Not a market price."
    }

