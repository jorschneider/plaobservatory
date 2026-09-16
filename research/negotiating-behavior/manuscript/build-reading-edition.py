"""Build the self-contained HTML reading edition with Pandoc 2.19 or newer."""
from pathlib import Path
import hashlib
import json
import os
import re
import subprocess
import tempfile
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "reading-edition.html"
PARTS = sorted((ROOT / "chapters").glob("*.md")) + sorted((ROOT / "appendices").glob("*.md"))
IDS = {p.resolve(): ("ch-" if p.parent.name == "chapters" else "app-") + p.name[:2] for p in PARTS}


def prepare(path):
    text = path.read_text()
    prefix = IDS[path.resolve()]
    text = re.sub(r"^\*First[^\n]*\*\s*$", "", text, flags=re.M)
    text = re.sub(r"^\*Complete manuscript draft[^\n]*\*\s*$", "", text, flags=re.M)
    text = re.sub(r"^## Notes\s*$", "", text, flags=re.M)
    text = re.sub(r"\[\^([^\]]+)\]", lambda m: f"[^{prefix}-{m[1]}]", text)
    heading_count = 0

    def heading(match):
        nonlocal heading_count
        heading_count += 1
        ident = prefix if heading_count == 1 else f"{prefix}-section-{heading_count}"
        return f"{match[1]} {match[2]} {{#{ident}}}"

    text = re.sub(r"^(#{1,6}) (.+)$", heading, text, flags=re.M)

    def link(match):
        label, url = match.groups()
        if re.match(r"(?:https?://|mailto:|#)", url):
            return match[0]
        name, separator, fragment = url.partition("#")
        target = (path.parent / unquote(name)).resolve()
        if target in IDS:
            return f"[{label}](#{IDS[target]})"
        relative = os.path.relpath(target, ROOT).replace(os.sep, "/")
        return f"[{label}]({relative}{separator}{fragment})"

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, text).strip()


intro = """::: {.edition-note}
**Working manuscript · developmental revision · 15 September 2026**

An original reassessment of Richard H. Solomon’s *Chinese Negotiating Behavior*,
with seven chapters, a conclusion and three research appendices. Individual cases
have different event endpoints. No new interviews or private Chinese archive access
are claimed. This is not an authorized new edition.

Use the contents to move between chapters. Numbered notes link to the sources and
back to the text. Supporting local files are available with the research repository.
:::
"""
combined = intro + "\n\n" + "\n\n".join(prepare(p) for p in PARTS)
with tempfile.TemporaryDirectory(prefix="solomon-reading-") as temp:
    source = Path(temp) / "edition.md"
    source.write_text(combined)
    subprocess.run([
        "pandoc", str(source), "--from=markdown+footnotes+fenced_divs",
        "--to=html5", "--standalone", "--embed-resources", "--toc", "--toc-depth=2",
        "--metadata=lang:en", "--metadata=title:Bargaining with China",
        "--metadata=subtitle:Authority, commitments and change",
        "--metadata=date:Research edition · 15 September 2026",
        "--css", str(ROOT / "reading-edition.css"), "--output", str(OUT)
    ], check=True)

# Keep wide research tables inside the page on narrow screens.
rendered = OUT.read_text()
rendered = re.sub(r'<table(\s[^>]*)?>', r'<div class="table-scroll" tabindex="0"><table\1>', rendered)
rendered = rendered.replace('</table>', '</table></div>')
OUT.write_text(rendered)

manifest = {
    "title": "Bargaining with China: authority, commitments and change",
    "edition": "Working manuscript, developmental revision, 2026-09-15",
    "format": "Self-contained HTML; local supporting links require the research repository",
    "build_script": "build-reading-edition.py",
    "sources": [{"path": str(p.relative_to(ROOT)), "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in PARTS],
    "output": {"path": OUT.name, "sha256": hashlib.sha256(OUT.read_bytes()).hexdigest()},
    "note": "Integrity and rendering record; not a claim that historical assertions are mechanically verified."
}
(ROOT / "reading-edition-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(f"Built {OUT.name}: {len(PARTS)} parts, {OUT.stat().st_size:,} bytes")
