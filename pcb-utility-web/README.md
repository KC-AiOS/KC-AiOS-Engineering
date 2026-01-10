# PCB Utility Rate Web Tool (Lite)

## Purpose
This tool provides a quick engineering estimation of PCB panel utility rate.
It is intended for early-stage design and cost evaluation only.

## What This Tool Does
- Calculates PCB utility rate based on geometry
- Compares original orientation vs 90-degree rotated placement
- Displays PCB count and area utilization

## Inputs
- PCB Width / Height (mm)
- Panel Width / Height (mm)
- Edge Margin (mm)
- Gap between PCBs (mm)

## Calculation Assumptions
- Rectangular PCB shape
- Uniform gap and edge margin
- No routing path, V-cut direction, or yield consideration
- Geometry estimation only

## Disclaimer
This tool is for engineering estimation only.
It does not represent final manufacturing feasibility or cost guarantee.

## Deployment
- Upload files to a GitHub repository
- Enable GitHub Pages (main branch / root)
- Access via browser
