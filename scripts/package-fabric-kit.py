"""Package the reproducible student kit, never installed dependencies or keys."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import shutil

ROOT = Path(__file__).resolve().parents[1]
KIT = ROOT / "workshop" / "fabric-credits"
PUBLIC = ROOT / "public" / "workshop"
PUBLIC.mkdir(parents=True, exist_ok=True)
active = KIT / "chaincode" / "lib" / "transfer-rules.js"
solution = KIT / "solution" / "transfer-rules.js"
if active.read_bytes() != solution.read_bytes():
    raise SystemExit("Save your active rule edits; select the completed solution before publishing the kit.")
shutil.copyfile(KIT / "starter" / "transfer-rules.js", PUBLIC / "transfer-rules.starter.js")
shutil.copyfile(solution, PUBLIC / "transfer-rules.solution.js")
guide = ROOT / "output" / "pdf" / "fabric-student-installation-guide.pdf"
if guide.exists():
    shutil.copyfile(guide, PUBLIC / "fabric-installation-guide.pdf")
with ZipFile(PUBLIC / "campus-credits-kit.zip", "w", ZIP_DEFLATED) as archive:
    for file in sorted(KIT.rglob("*")):
        if not file.is_file() or "node_modules" in file.parts or "__pycache__" in file.parts:
            continue
        if file.name.startswith(".env") or file.suffix.lower() in {".pem", ".key", ".p12", ".pfx"}:
            continue
        archive.write(file, file.relative_to(KIT).as_posix())
    archive.write(PUBLIC / "student-handout.md", "STUDENT-HANDOUT.md")
    archive.write(PUBLIC / "workshop-syllabus.md", "WORKSHOP-SYLLABUS.md")
print("Packaged starter, solution, contract, application, tests and handout. No private credentials included.")
