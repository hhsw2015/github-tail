#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import json
import os
import sys
from datetime import datetime, timezone

import requests

# 参数解析
parser = argparse.ArgumentParser(description="GitHub 最近更新项目抓取工具")
parser.add_argument("-k", "--keyword", type=str, help="搜索关键字")
parser.add_argument("--max-results", type=str, help="最多返回数量")
parser.add_argument("--min-stars", type=str, help="最低星数")
parser.add_argument("--out", type=str, help="输出文件路径")
parser.add_argument("--token", type=str, help="GitHub Token")
args = parser.parse_args()

# 参数最终值
max_results = int(args.max_results) or int(os.environ.get("MAX_RESULTS", "50"))
min_stars = 20
if int(args.min_stars) >= 0:
    min_stars = int(args.min_stars)
else:
    min_stars = int(os.environ.get("MIN_STARS", "20"))
out_path = args.out or os.environ.get("OUT_PATH", "data/projects.json")
keyword = (args.keyword or os.environ.get("GITHUB_KEYWORD") or "").strip()
token = args.token or os.environ.get("GH_API_TOKEN")

# 参数打印
print("运行参数", file=sys.stderr)
print("=" * 55, file=sys.stderr)
print(f"关键字     → {keyword or '无'}", file=sys.stderr)
print(f"最低星数   → {min_stars}", file=sys.stderr)
print(f"最多返回   → {max_results}", file=sys.stderr)
print(f"输出文件   → {out_path}", file=sys.stderr)
print(f"Token      → {'已提供' if token else '未提供'}", file=sys.stderr)
print("=" * 55, file=sys.stderr)


def get_last_updated(path):
    if not os.path.exists(path):
        return None
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f).get("last_updated")
    except:
        return None


def format_time(dt_str):
    """Convierte ISO datetime a formato para GitHub Search (YYYY-MM-DDTHH:MM:SS)"""
    try:
        dt = datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%dT%H:%M:%S")
    except Exception:
        return None


# 构建 query
parts = [f"stars:>={min_stars}"]
if keyword:
    parts.insert(0, keyword)
last = get_last_updated(out_path)
if last:
    t = format_time(last)
    if t:
        parts.append(f"pushed:>{t}")
        print(f"增量模式 → {t} 之后", file=sys.stderr)

q = " ".join(parts)
print(f"查询语句 → {q}", file=sys.stderr)
print()

headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "fetcher",
}
if token:
    headers["Authorization"] = f"Bearer {token}"

repos = []
for page in range(1, (max_results // 100) + 3):
    params = {"q": q, "sort": "updated", "order": "desc", "per_page": 100, "page": page}
    r = requests.get(
        "https://api.github.com/search/repositories",
        params=params,
        headers=headers,
        timeout=30,
    )
    if r.status_code == 403:
        print("限流了！请加 --token", file=sys.stderr)
        sys.exit(1)
    r.raise_for_status()
    items = r.json().get("items", [])
    repos.extend(items)
    print(f"第 {page} 页: {len(items)} 条", file=sys.stderr)
    if len(items) < 100:
        break

# 处理数据
projects = []
for r in repos:
    o = r.get("owner", {})
    projects.append(
        {
            "id": r["id"],
            "name": r["name"],
            "full_name": r["full_name"],
            "html_url": r["html_url"],
            "description": r.get("description") or "",
            "stargazers_count": r["stargazers_count"],
            "language": r.get("language"),
            "pushed_at": r["pushed_at"],
            "updated_at": r["updated_at"],
            "fork": r["fork"],
            "owner": {
                "login": o.get("login"),
                "avatar_url": o.get("avatar_url"),
                "html_url": o.get("html_url"),
            },
        }
    )

# projects.sort(key=lambda x: x["updated_at"], reverse=True)
projects.sort(key=lambda x: x["pushed_at"], reverse=True)
projects = projects[:max_results]

# 保存
os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(
        {
            "source": {
                "type": "github_search",
                "query": q,
                "keyword": keyword or None,
                "min_stars": min_stars,
            },
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "count": len(projects),
            "projects": projects,
        },
        f,
        ensure_ascii=False,
        indent=2,
    )

print(f"\n成功！保存 {len(projects)} 个项目 → {out_path}", file=sys.stderr)
