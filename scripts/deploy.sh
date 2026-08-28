#!/usr/bin/env bash

set -euo pipefail

readonly PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly DEPLOY_HOST="${ARTTHERAPY_DEPLOY_HOST:-bn}"
readonly REMOTE_DIST_DIR="${ARTTHERAPY_REMOTE_DIST_DIR:-/root/workspace/miniapp_pro_web_dist}"
readonly DEPLOY_URL="${ARTTHERAPY_DEPLOY_URL:-https://arttherapy.starryspark.com.cn/}"
readonly DEPENDENCY_STAMP="${PROJECT_DIR}/node_modules/.package-lock.sha256"

logStep() {
  printf '\n==> %s\n' "$1"
}

assertSourcePublished() {
  logStep '1/6 检查源码提交状态'
  if [[ -n "$(git -C "$PROJECT_DIR" status --porcelain)" ]]; then
    printf '错误：前端仓库仍有未提交改动。请先提交并推送。\n' >&2
    exit 1
  fi
  git -C "$PROJECT_DIR" fetch origin main
  if [[ "$(git -C "$PROJECT_DIR" rev-parse HEAD)" != "$(git -C "$PROJECT_DIR" rev-parse origin/main)" ]]; then
    printf '错误：本地 main 与 origin/main 不一致。请先完成推送。\n' >&2
    exit 1
  fi
}

installDependencies() {
  local currentHash
  local installedHash=''
  currentHash="$(shasum -a 256 "$PROJECT_DIR/package-lock.json" | awk '{print $1}')"
  if [[ -f "$DEPENDENCY_STAMP" ]]; then
    installedHash="$(<"$DEPENDENCY_STAMP")"
  fi
  if [[ -d "$PROJECT_DIR/node_modules" && "$currentHash" == "$installedHash" ]]; then
    logStep '2/6 依赖未变化，跳过安装'
    return
  fi
  logStep '2/6 在本地安装依赖'
  npm --prefix "$PROJECT_DIR" ci --prefer-offline
  printf '%s\n' "$currentHash" > "$DEPENDENCY_STAMP"
}

buildLocally() {
  logStep '3/6 在本地检查并构建'
  npm --prefix "$PROJECT_DIR" run lint
  npm --prefix "$PROJECT_DIR" run build
  test -f "$PROJECT_DIR/dist/index.html"
}

syncStaticAssets() {
  logStep '4/6 同步带版本的静态资源'
  ssh "$DEPLOY_HOST" "mkdir -p '$REMOTE_DIST_DIR'"
  rsync -az --exclude 'index.html' "$PROJECT_DIR/dist/" "$DEPLOY_HOST:$REMOTE_DIST_DIR/"
}

publishEntryAtomically() {
  logStep '5/6 原子发布页面入口'
  rsync -az "$PROJECT_DIR/dist/index.html" "$DEPLOY_HOST:$REMOTE_DIST_DIR/.index.html.next"
  ssh "$DEPLOY_HOST" "mv '$REMOTE_DIST_DIR/.index.html.next' '$REMOTE_DIST_DIR/index.html'"
}

verifyDeployment() {
  local localHash
  local remoteHash
  logStep '6/6 验证构建产物与线上页面'
  localHash="$(shasum -a 256 "$PROJECT_DIR/dist/index.html" | awk '{print $1}')"
  remoteHash="$(ssh "$DEPLOY_HOST" "sha256sum '$REMOTE_DIST_DIR/index.html'" | awk '{print $1}')"
  [[ "$localHash" == "$remoteHash" ]]
  curl --fail --silent --show-error --location --output /dev/null "$DEPLOY_URL"
  printf '部署完成：%s\n' "$DEPLOY_URL"
}

main() {
  assertSourcePublished
  installDependencies
  buildLocally
  syncStaticAssets
  publishEntryAtomically
  verifyDeployment
}

main "$@"
