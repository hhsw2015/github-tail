#!/usr/bin/env bash
# GitHub 热榜 → 左边只显示项目名，右边完美预览（最终永不翻车版）
URL="https://raw.githubusercontent.com/alcastelo/github-tail/refs/heads/master/data/projects.json"
CACHE="/tmp/github-tail.json"
INDEX="/tmp/github-tail.idx"
PREVIEW_SCRIPT="/tmp/github-tail-preview.sh"

# 强制清理旧文件（可选，但强烈推荐）
rm -f "$CACHE" "$INDEX" "$PREVIEW_SCRIPT"

# 重新下载最新数据（去除10分钟缓存，始终刷新）
curl -fsSL "$URL" -o "$CACHE" || {
  echo "下载失败"
  exit 1
}

# 生成去重后的索引：按 full_name 去重，保留 stars 最高的
jq -r '
  .projects[] 
  | [
      .name,
      .full_name,
      .owner.login,
      .stargazers_count // 0,
      (.language // "—"),
      (.pushed_at // "1970-01-01 00:00:00 UTC" | sub("T";" ") | sub("Z$";" UTC") | .[:19]),
      (.description // "无描述")
    ] | @tsv
' "$CACHE" |
  sort -t $'\t' -k2,2 -k4nr |
  awk -F'\t' '!seen[$2]++' >"$INDEX"

# 生成一个真正的预览脚本（完全没有引号问题）
cat >"$PREVIEW_SCRIPT" <<'EOF'
#!/bin/bash
full="$1" # fzf 传进来的 {2}
while IFS=$'\t' read -r name repo owner stars lang push desc; do
    if [[ "$repo" == "$full" ]]; then
        echo -e "\033[1;34mProject :\033[0m $name"
        echo -e "\033[1;35mOwner :\033[0m $owner"
        echo -e "\033[1;36mURL :\033[0m https://github.com/$repo"
        echo -e "\033[1;33mStars :\033[0m $stars"
        echo -e "\033[1;32mLanguage :\033[0m $lang"
        echo -e "\033[1;35mLast push :\033[0m $push"
        echo
        echo -e "\033[1mDescription:\033[0m"
        echo "$desc" | fold -sw 80
        exit 0
    fi
done < /tmp/github-tail.idx
EOF
chmod +x "$PREVIEW_SCRIPT"

# 两个排序列表
list_time=$(cut -f1,2 "$INDEX")
list_star=$(sort -t $'\t' -k4 -nr "$INDEX" | cut -f1,2)

# 启动 fzf
selected=$(printf '%s\n' "$list_time" | fzf \
  --multi \
  --with-nth=1 \
  --delimiter=$'\t' \
  --prompt="GitHub 最新活跃 > " \
  --header="r = 按 Star 排序 Ctrl+R = 刷新 Tab 多选 Enter 打开" \
  --preview="$PREVIEW_SCRIPT {2}" \
  --preview-window=right:65%:wrap \
  --bind="r:reload(printf '%s\n' \"$list_star\")+change-prompt(Star排序 > )" \
  --bind="ctrl-r:execute-silent(curl -fsSL $URL -o $CACHE >/dev/null 2>&1)+reload(printf '%s\n' \"$list_time\")+change-prompt(GitHub 最新活跃 > )")

# 清理临时脚本（可选）
rm -f "$PREVIEW_SCRIPT"

# 没选就退出
[[ -z "$selected" ]] && exit 0

# 打开所有选中项目
echo "$selected" | cut -f2 | xargs -n1 -I{} xdg-open "https://github.com/{}" 2>/dev/null ||
  echo "$selected" | cut -f2 | xargs -n1 -I{} open "https://github.com/{}" 2>/dev/null ||
  echo "$selected" | cut -f2 | xargs -n1 -I{} wslview "https://github.com/{}" 2>/dev/null
echo "已打开 $(echo "$selected" | wc -l) 个项目"
