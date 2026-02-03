from pydantic import BaseModel, Field

class COGInput(BaseModel):
    cog_count: int = Field(..., ge=2, le=6)
    process_time_per_cog: float = Field(..., gt=0)
    yield_rate: float = Field(..., gt=0.8, le=0.99)

class BLUInput(BaseModel):
    optical_layers: int = Field(..., ge=3, le=6)
    alignment_time_per_layer: float = Field(..., gt=0)
    yield_rate: float = Field(..., gt=0.85, le=0.99)

class PCBAInput(BaseModel):
    board_count: int = Field(..., ge=1, le=2)
    smt_time_per_board: float = Field(..., gt=0)
    test_time_per_board: float = Field(..., gt=0)
    yield_rate: float = Field(..., gt=0.9, le=0.99)

class AssemblyInput(BaseModel):
    assembly_steps: int = Field(..., ge=5)
    time_per_step: float = Field(..., gt=0)
    final_yield: float = Field(..., gt=0.9, le=0.99)

class LaborInput(BaseModel):
    labor_rate_per_min: float = Field(..., gt=0)

class CostRequest(BaseModel):
    cog: COGInput
    blu: BLUInput
    pcba: PCBAInput
    assembly: AssemblyInput
    labor: LaborInput
