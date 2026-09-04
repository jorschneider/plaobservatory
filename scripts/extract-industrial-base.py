#!/usr/bin/env python3
"""Extract the Supplier Scorecards v1.2 workbook into research/industrial-base/scorecards-v1.2.json.
The workbook stays the source of truth; this script is deterministic and makes no edits by hand.
Requires openpyxl.  Usage: python3 scripts/extract-industrial-base.py"""
import json, re, sys
from pathlib import Path
import openpyxl
ROOT = Path(__file__).resolve().parent.parent
XLSX = ROOT / "research/industrial-base/supplier-scorecards-v1.2/China_Defense_Industrial_Atlas_Supplier_Scorecards_v1.2.xlsx"
OUT = ROOT / "research/industrial-base/scorecards-v1.2.json"
def key(h):
    k = re.sub(r"[^0-9a-zA-Z]+", "_", str(h).strip()).strip("_").lower()
    return {"c": "criticality", "i": "frontier", "x": "cross_domain", "e": "evidence"}.get(k, k)
def cell(v):
    if v is None: return None
    if isinstance(v, float) and v.is_integer(): return int(v)
    if isinstance(v, str):
        s = v.strip()
        if re.fullmatch(r"-?\d+", s): return int(s)
        if re.fullmatch(r"-?\d+\.\d+", s): return float(s)
        return s
    return v if not hasattr(v, "isoformat") else v.isoformat()[:10]
wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
sheets = {}
for ws in wb.worksheets:
    rows = [r for r in ws.iter_rows(values_only=True) if any(c is not None for c in r)]
    title, blurb, header, data = rows[0][0], rows[1][0], rows[2], rows[3:]
    if ws.title == "Read Me":
        # two side-by-side tables: coverage metrics and reading notes
        metrics = [{"metric": r[0], "count": cell(r[1])} for r in data if r[0]]
        notes = [{"note": r[3]} for r in data if len(r) > 3 and r[3]]
        sheets["readMe"] = {"title": title, "blurb": blurb, "metrics": metrics, "notes": notes}
        continue
    if ws.title == "Scoring Method":
        weights = [{"component": r[0], "weight": cell(r[1]), "interpretation": r[2]} for r in data if r[0]]
        factors = [{"evidenceLevel": r[4], "lowerBoundMultiplier": cell(r[5]), "rankTreatment": r[6], "hardBoundary": r[7]} for r in data if len(r) > 4 and r[4]]
        sheets["scoringMethod"] = {"title": title, "blurb": blurb, "weights": weights, "evidenceFactors": factors}
        continue
    keys = [key(h) if h is not None else f"col_{i}" for i, h in enumerate(header)]
    records = [{keys[i]: cell(v) for i, v in enumerate(r) if i < len(keys) and v is not None} for r in data]
    name = {"Scorecard Ranking": "ranking", "Capability Assessments": "assessments", "Evidence Ledger": "evidence", "Robots AI Drones": "robotsAiDrones", "Foreign Dependencies": "foreignDependencies", "Signals & Gaps": "signals", "Source Register": "sources", "Bibliographic Essay": "bibliography"}[ws.title]
    sheets[name] = {"title": title, "blurb": blurb, "columns": keys, "records": records}
out = {"package": "China Defense-Industrial Atlas Supplier Scorecards v1.2", "extractedFrom": XLSX.name, "sheets": sheets}
OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(json.dumps({k: (len(v.get("records", [])) if "records" in v else "table") for k, v in sheets.items()}))
for k, v in sheets.items():
    if "columns" in v: print(k, v["columns"])
