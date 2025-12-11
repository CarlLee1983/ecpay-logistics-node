# 發布前測試腳本

## 本機測試發布流程

雖然 OIDC 身份驗證只能在 GitHub Actions 環境中實際使用，但你可以使用以下方法在本機測試發布流程：

### 方法 1: 使用測試腳本（推薦）

```bash
# 執行完整的發布前檢查
bun run test:publish
```

這個腳本會：
- ✅ 執行類型檢查
- ✅ 執行 lint 檢查
- ✅ 執行測試
- ✅ 構建套件
- ✅ 驗證構建產物
- ✅ 檢查 package.json 配置
- ✅ 執行 npm publish dry-run

### 方法 2: 使用 npm dry-run

```bash
# 只測試 npm 發布流程（不實際上傳）
bun run publish:dry-run
```

或直接使用：

```bash
npm publish --dry-run --access public
```

### 方法 3: 使用 act 模擬 GitHub Actions

如果你想要更接近真實環境的測試，可以使用 [act](https://github.com/nektos/act) 工具：

```bash
# 安裝 act (macOS)
brew install act

# 執行 release workflow
act push -W .github/workflows/release.yml
```

**注意**: act 無法完全模擬 OIDC，但可以測試其他步驟。

### 方法 4: 檢查配置

手動檢查以下配置：

1. **package.json repository URL**
   ```bash
   grep -A 2 '"repository"' package.json
   ```
   確認 URL 中的用戶名是 `CarlLee1983`（大小寫匹配）

2. **構建產物**
   ```bash
   ls -la dist/esm/
   ls -la dist/cjs/
   ls -la dist/types/
   ```

3. **要發布的檔案**
   ```bash
   npm pack --dry-run
   ```

## OIDC 配置檢查清單

在實際發布前，確保：

- [ ] npm 已設定受信任的發布者（Trusted Publishers）
  - GitHub 用戶/組織：`CarlLee1983`（注意大小寫）
  - 倉庫：`CarlLee1983/ecpay-logistics-node`
  - 工作流程：`.github/workflows/release.yml`

- [ ] package.json 中的 repository URL 正確
- [ ] GitHub Actions workflow 有 `id-token: write` 權限
- [ ] 已移除 `NODE_AUTH_TOKEN` 環境變數

## 實際發布

當所有測試通過後，推送到 GitHub，GitHub Actions 會自動：
1. 執行 release-please 創建 release
2. 觸發 publish job
3. 使用 OIDC 進行身份驗證
4. 發布到 npm

