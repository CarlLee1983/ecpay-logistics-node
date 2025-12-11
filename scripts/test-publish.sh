#!/bin/bash
# 本機測試發布流程腳本
# 用於驗證發布前的所有步驟是否正常

set -e

echo "🔍 開始測試發布流程..."
echo ""

# 1. 檢查類型
echo "📝 步驟 1: 執行類型檢查..."
bun run typecheck || {
  echo "❌ 類型檢查失敗"
  exit 1
}
echo "✅ 類型檢查通過"
echo ""

# 2. 執行 lint
echo "📝 步驟 2: 執行 lint 檢查..."
bun run lint || {
  echo "❌ Lint 檢查失敗"
  exit 1
}
echo "✅ Lint 檢查通過"
echo ""

# 3. 執行測試
echo "📝 步驟 3: 執行測試..."
bun run test || {
  echo "❌ 測試失敗"
  exit 1
}
echo "✅ 測試通過"
echo ""

# 4. 構建
echo "📝 步驟 4: 構建套件..."
bun run build || {
  echo "❌ 構建失敗"
  exit 1
}
echo "✅ 構建成功"
echo ""

# 5. 驗證構建產物
echo "📝 步驟 5: 驗證構建產物..."
if [ ! -f "dist/esm/index.js" ]; then
  echo "❌ dist/esm/index.js 不存在"
  exit 1
fi
if [ ! -f "dist/cjs/index.js" ]; then
  echo "❌ dist/cjs/index.js 不存在"
  exit 1
fi
if [ ! -d "dist/types" ]; then
  echo "❌ dist/types 目錄不存在"
  exit 1
fi
echo "✅ 構建產物驗證通過"
echo ""

# 6. 檢查 package.json 配置
echo "📝 步驟 6: 檢查 package.json 配置..."
if ! grep -q '"repository"' package.json; then
  echo "❌ package.json 缺少 repository 欄位"
  exit 1
fi
if ! grep -q 'CarlLee1983' package.json; then
  echo "⚠️  警告: package.json 中可能缺少正確的 GitHub 用戶名"
fi
echo "✅ package.json 配置檢查通過"
echo ""

# 7. 測試 npm publish (dry-run)
echo "📝 步驟 7: 測試 npm publish (dry-run)..."
npm publish --dry-run --access public || {
  echo "❌ npm publish dry-run 失敗"
  exit 1
}
echo "✅ npm publish dry-run 成功"
echo ""

# 8. 檢查要發布的檔案
echo "📝 步驟 8: 檢查要發布的檔案..."
npm pack --dry-run 2>&1 | head -20
echo ""

echo "✅ 所有測試通過！"
echo ""
echo "📋 發布前檢查清單："
echo "  ✅ 類型檢查通過"
echo "  ✅ Lint 檢查通過"
echo "  ✅ 測試通過"
echo "  ✅ 構建成功"
echo "  ✅ 構建產物完整"
echo "  ✅ package.json 配置正確"
echo "  ✅ npm publish dry-run 成功"
echo ""
echo "💡 注意事項："
echo "  - OIDC 身份驗證只能在 GitHub Actions 環境中測試"
echo "  - 確保 npm 已設定受信任的發布者（Trusted Publishers）"
echo "  - GitHub 用戶名必須與 npm 設定完全匹配（包括大小寫）"
echo "  - 實際發布時，GitHub Actions 會自動使用 OIDC 進行身份驗證"

