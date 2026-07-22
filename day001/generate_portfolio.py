#!/usr/bin/env python3
"""100 DaysポートフォリオのREADME一覧を生成・更新するCLI。"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

START = "<!-- PORTFOLIO:START -->"
END = "<!-- PORTFOLIO:END -->"
DAY_PATTERN = re.compile(r"^day(\d{3})$")
TITLE_PATTERN = re.compile(r"^#\s+(.+?)\s*$", re.MULTILINE)


def project_info(directory: Path) -> tuple[int, str, str] | None:
    match = DAY_PATTERN.match(directory.name)
    readme = directory / "README.md"
    if not match or not readme.is_file():
        return None

    content = readme.read_text(encoding="utf-8")
    title_match = TITLE_PATTERN.search(content)
    if not title_match:
        return None

    title = title_match.group(1).strip()
    description = ""
    for line in content[title_match.end() :].splitlines():
        line = line.strip()
        if line and not line.startswith("#") and not line.startswith("<!--"):
            description = re.sub(r"[*`]", "", line)
            break
    return int(match.group(1)), title, description or "詳細はREADMEを参照"


def build_table(root: Path) -> str:
    projects = sorted(
        (info for path in root.iterdir() if path.is_dir() if (info := project_info(path))),
        key=lambda item: item[0],
    )
    rows = [
        "| Day | プロジェクト名 | 概要 |",
        "| :--- | :--- | :--- |",
    ]
    rows.extend(
        f"| Day {day} | [{title}](./day{day:03d}/README.md) | {description} |"
        for day, title, description in projects
    )
    return "\n".join(rows)


def update_readme(root: Path, readme_path: Path) -> bool:
    table = build_table(root)
    generated = f"{START}\n\n{table}\n\n{END}"
    if readme_path.exists():
        content = readme_path.read_text(encoding="utf-8")
        pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
        if pattern.search(content):
            updated = pattern.sub(generated, content, count=1)
        else:
            separator = "\n\n" if content.endswith("\n") else "\n\n"
            updated = content.rstrip() + separator + generated + "\n"
    else:
        updated = "# 100 Days of Code\n\n各Dayのプロジェクト一覧です。\n\n" + generated + "\n"

    changed = not readme_path.exists() or readme_path.read_text(encoding="utf-8") != updated
    readme_path.write_text(updated, encoding="utf-8")
    return changed


def main() -> int:
    parser = argparse.ArgumentParser(description="Dayプロジェクト一覧をREADMEに生成します")
    parser.add_argument("root", type=Path, help="Dayフォルダが並ぶリポジトリルート")
    parser.add_argument("--readme", type=Path, help="更新対象README（既定: root/README.md）")
    args = parser.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        parser.error(f"rootがディレクトリではありません: {root}")
    readme = (args.readme or root / "README.md").resolve()
    changed = update_readme(root, readme)
    print(f"READMEを{'更新しました' if changed else '確認しました'}: {readme}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
