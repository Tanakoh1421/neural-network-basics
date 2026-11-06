"""編集用ソースから、外部依存のない配布用HTMLを生成する。"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
src = ROOT / "src"
html = (src / "template.html").read_text(encoding="utf-8")
for token, filename in [("STYLE", "style.css"), ("DIAGRAMS", "diagrams.js"), ("CONTENT", "content.js"), ("APP", "app.js")]:
    html = html.replace(f"/* {token} */", (src / filename).read_text(encoding="utf-8"))
for output in [ROOT / "ニューラルネットの基礎.html", ROOT / "dist" / "index.html"]:
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(html, encoding="utf-8")
print(f"生成しました：{ROOT / 'ニューラルネットの基礎.html'} ({len(html.encode('utf-8')):,} bytes)")
