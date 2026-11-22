#!/usr/bin/env python3
"""Fetch and publish the official Propathlima group F/ΣΤ standings."""
import json
import re
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

URL = "https://propathlima.gr/group-f-26-27/"
OUT = Path("data/standings-live.json")

class Tables(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tables, self.table, self.row, self.cell = [], None, None, None
        self.in_cell = False

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.table = []
        elif tag == "tr" and self.table is not None:
            self.row = []
        elif tag in ("td", "th") and self.row is not None:
            self.cell = []
            self.in_cell = True

    def handle_data(self, data):
        if self.in_cell and self.cell is not None:
            self.cell.append(data)

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.in_cell:
            value = re.sub(r"\\s+", " ", "".join(self.cell or [])).strip()
            self.row.append(value)
            self.cell, self.in_cell = None, False
        elif tag == "tr" and self.row is not None:
            if self.row:
                self.table.append(self.row)
            self.row = None
        elif tag == "table" and self.table is not None:
            self.tables.append(self.table)
            self.table = None

def main():
    request = urllib.request.Request(URL, headers={"User-Agent": "PAPEI-SC-Standings-Bot/1.0"})
    with urllib.request.urlopen(request, timeout=25) as response:
        html = response.read().decode("utf-8", errors="replace")

    parser = Tables()
    parser.feed(html)
    standings = None
    matchday = 0
    for table in parser.tables:
        if not table:
            continue
        header = [re.sub(r"\\s+", " ", x).strip().lower() for x in table[0]]
        if header[:10] == ["pos", "club", "p", "w", "d", "l", "f", "a", "gd", "pts"]:
            standings = table[1:]
        if "match day" in header:
            idx = header.index("match day")
            for row in table[1:]:
                if len(row) > idx and row[idx].isdigit():
                    matchday = max(matchday, int(row[idx]))

    if not standings or len(standings) < 5 or matchday < 1:
        raise RuntimeError("Could not safely identify standings and latest matchday; keeping previous data.")

    rows = []
    for row in standings:
        if len(row) < 10 or not row[0].isdigit():
            continue
        pos, club, played, won, drawn, lost, gf, ga, gd, points = row[:10]
        if not all(x.isdigit() for x in (pos, played, won, drawn, lost, gf, ga, points)):
            continue
        rows.append([int(pos), club, int(played), int(won), int(drawn), int(lost),
                     f"{int(gf)}-{int(ga)}", int(gd), int(points)])

    if len(rows) < 5:
        raise RuntimeError("Parsed too few standings rows; keeping previous data.")

    payload = {
        "source": URL,
        "season": "2026/27",
        "group": "ΣΤ Όμιλος",
        "matchday": matchday,
        "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "table": rows,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
    print(f"Published {len(rows)} teams through matchday {matchday}.")

if __name__ == "__main__":
    main()
