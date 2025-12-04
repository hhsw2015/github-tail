#!/usr/bin/env bash
# GitHub 热榜 → 左边只显示项目名，右边完美预览（最终永不翻车版）
URL="https://raw.githubusercontent.com/alcastelo/github-tail/refs/heads/master/data/projects.json"
CACHE="/tmp/github-tail.json"
INDEX="/tmp/github-tail.idx"
PREVIEW_SCRIPT="/tmp/github-tail-preview.sh"

# 强制清理旧文件（推荐）
rm -f "$CACHE" "$INDEX" "$PREVIEW_SCRIPT"

KEYWORD=""
TOKEN=""
MIN_STARS=20
MAX_RESULTS=500
if [ $# -eq 1 ] || [ $# -eq 2 ] || [ $# -eq 3 ] || [ $# -eq 4 ]; then
  # 有参数：调用本地 github_active_api.py

  if [ $# -eq 2 ]; then
    TOKEN="$1"
    KEYWORD="$2"
    echo "使用自定义 Token 并搜索关键词：$KEYWORD"
  elif [ $# -eq 3 ]; then
    TOKEN="$1"
    KEYWORD="$2"
    MAX_RESULTS="$3"
    echo "使用自定义 Token 并搜索关键词：$KEYWORD"
  elif [ $# -eq 4 ]; then
    TOKEN="$1"
    KEYWORD="$2"
    MAX_RESULTS="$3"
    MIN_STARS="$4"
    echo "使用自定义 Token 并搜索关键词：$KEYWORD MIN_STARS: $MIN_STARS"
  else
    echo "请提供Github Token"
    exit 1
  fi

  # 检查本地脚本是否存在
  if [ ! -x "./github_active_api.py" ]; then
    echo "错误：当前目录下不存在可执行的 ./github_active_api.py"
    exit 1
  fi

  # 执行本地 API 脚本
  ./github_active_api.py -k "$KEYWORD" \
    --token "$TOKEN" \
    --out "$CACHE" \
    --min-stars "$MIN_STARS" \
    --max-results "$MAX_RESULTS" || {
    echo "github_active_api.py 执行失败"
    exit 1
  }

  # 确保生成了有效文件
  if [ ! -s "$CACHE" ] || ! grep -q '"projects"' "$CACHE" 2>/dev/null; then
    echo "github_active_api.py 未生成有效 JSON 数据"
    exit 1
  fi
else
  # 无参数：使用官方热榜
  echo "正在获取官方 GitHub 热榜..."
  curl -fsSL "$URL" -o "$CACHE" || {
    echo "下载官方热榜失败"
    exit 1
  }
fi

echo "数据已准备好（共 $(jq '.projects | length' "$CACHE") 个项目）"

# 生成去重后的索引：按 full_name 去重，保留 stars 最高的
jq -r '
  .projects[] 
  | [
      .full_name,
      .full_name,
      .owner.login,
      .stargazers_count // 0,
      (.language // "—"),
      (.pushed_at // "1970-01-01 00:00:00 UTC" | sub("T";" ") | sub("Z$";" UTC") | .[:19]),
      (.description // "无描述")
    ] | @tsv
' "$CACHE" |
  #sort -t $'\t' -k2,2 -k4nr |
  awk -F'\t' '!seen[$2]++ {print}' >"$INDEX"

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
#list_time=$(cut -f1,2 "$INDEX")
list_time=$(cat "$INDEX")
list_star=$(sort -t $'\t' -k4 -nr "$INDEX" | cut -f1,2)

# 启动 fzf
selected=""
if [[ $KEYWORD == "" ]]; then
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
else
  selected=$(printf '%s\n' "$list_time" | fzf \
    --multi \
    --with-nth=1 \
    --delimiter=$'\t' \
    --prompt="GitHub 最新活跃 > " \
    --header="r = 按 Star 排序 Tab 多选 Enter 打开" \
    --preview="$PREVIEW_SCRIPT {2}" \
    --preview-window=right:65%:wrap \
    --bind="r:reload(printf '%s\n' \"$list_star\")+change-prompt(Star排序 > )")
fi

# 清理临时脚本（可选）
rm -f "$PREVIEW_SCRIPT"

# 没选就退出
[[ -z "$selected" ]] && exit 0

# 提取所有 full_name（第2列）
selected_repos=$(echo "$selected" | cut -f2)

# 统计数量
count=$(echo "$selected_repos" | wc -l | xargs)

# 转换为逗号分隔的单行字符串（去掉换行，末尾无多余逗号）
repos_list_copy=$(echo "$selected_repos" | paste -sd, - | sed 's/,/*/g')

# 打开所有选中项目
echo "$selected" | cut -f2 | xargs -n1 -I{} open "https://github.com/{}" 2>/dev/null
echo -e "已打开 \033[1;32m${count}\033[0m 个项目："
echo -e "${selected_repos}"

echo "${repos_list_copy}" | pbcopy
