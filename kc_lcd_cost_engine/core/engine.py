from .model import *

def calc_cog_cost(cog: COGParams, labor: LaborParams) -> float:
    base = cog.cog_count * cog.process_time_per_cog * labor.labor_rate_per_min
    return base / cog.yield_rate

def calc_blu_cost(blu: BLUParams, labor: LaborParams) -> float:
    base = blu.optical_layers * blu.alignment_time_per_layer * labor.labor_rate_per_min
    return base / blu.yield_rate

def calc_pcba_cost(pcba: PCBAParams, labor: LaborParams) -> float:
    base = (
        pcba.board_count
        * (pcba.smt_time_per_board + pcba.test_time_per_board)
        * labor.labor_rate_per_min
    )
    return base / pcba.yield_rate

def calc_assembly_cost(asm: AssemblyParams, labor: LaborParams) -> float:
    base = asm.assembly_steps * asm.time_per_step * labor.labor_rate_per_min
    return base / asm.final_yield

def calc_total_cost(cog, blu, pcba, asm, labor) -> float:
    return (
        calc_cog_cost(cog, labor)
        + calc_blu_cost(blu, labor)
        + calc_pcba_cost(pcba, labor)
        + calc_assembly_cost(asm, labor)
    )
