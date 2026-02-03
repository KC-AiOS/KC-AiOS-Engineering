from dataclasses import dataclass

@dataclass
class COGParams:
    cog_count: int
    process_time_per_cog: float   # min
    yield_rate: float             # 0~1

@dataclass
class BLUParams:
    optical_layers: int
    alignment_time_per_layer: float
    yield_rate: float

@dataclass
class PCBAParams:
    board_count: int
    smt_time_per_board: float
    test_time_per_board: float
    yield_rate: float

@dataclass
class AssemblyParams:
    assembly_steps: int
    time_per_step: float
    final_yield: float

@dataclass
class LaborParams:
    labor_rate_per_min: float
