# Release 流程說明

## 自動版本管理

本專案使用 [release-please](https://github.com/googleapis/release-please) 自動管理版本號和創建 release PR。

## 自動生成 PR 機制

### 當前配置狀態

✅ **已啟用自動生成 PR**

配置檔案：
- `.github/workflows/release.yml` - GitHub Actions workflow
- `release-please-config.json` - Release-please 配置
- `.release-please-manifest.json` - 版本追蹤

### 觸發條件

每次 **push 到 main 分支**時，release-please 會：

1. **檢查是否有新的符合 Conventional Commits 的 commit**
   - `feat:` → Minor 版本 (1.2.0 → 1.3.0)
   - `fix:` → Patch 版本 (1.2.0 → 1.2.1)
   - `BREAKING CHANGE:` → Major 版本 (1.2.0 → 2.0.0)

2. **如果有符合的 commit**：
   - 創建新的 release PR（如果還沒有）
   - 或更新現有的 release PR（如果已經存在）

3. **Release PR 內容**：
   - 更新 `package.json` 的版本號
   - 更新 `CHANGELOG.md`
   - PR 標題格式：`chore: release 1.2.1`

4. **合併 Release PR 後**：
   - 自動創建 Git tag
   - 創建 GitHub Release
   - 觸發 publish job 發布到 npm

## 版本號規則

根據 Conventional Commits 規範：

- **Major 版本** (1.2.0 → 2.0.0)
  - 提交訊息包含 `BREAKING CHANGE:` 或使用 `!` 標記
  - 範例：`feat!: 重大變更` 或 `feat: 新功能\n\nBREAKING CHANGE: 破壞性變更`

- **Minor 版本** (1.2.0 → 1.3.0)
  - 使用 `feat:` 開頭的提交
  - 範例：`feat: 新增 OIDC 支援`

- **Patch 版本** (1.2.0 → 1.2.1)
  - 使用 `fix:` 開頭的提交
  - 範例：`fix: 修復類型檢查問題`

## 手動控制版本號

### 方法 1: 使用 `release-as` 指令（推薦）

在提交訊息的正文中添加 `release-as: x.y.z` 來指定版本號：

```bash
git commit -m "fix: 修復重要問題

release-as: 1.2.1"
```

這會讓 release-please 在下一次運行時創建指定版本的 release PR。

### 方法 2: 直接修改 manifest 檔案

編輯 `.release-please-manifest.json`：

```json
{
  ".": "1.2.1"
}
```

然後提交並推送到 main 分支，release-please 會根據這個版本號創建 release PR。

### 方法 3: 在 PR 標題或描述中使用

在 PR 的標題或描述中添加：

```
release-as: 1.2.1
```

## 創建 Patch 版本 Release PR

### 場景 1: 快速修復需要立即發布

```bash
# 1. 創建修復 commit
git commit -m "fix: 修復緊急問題

release-as: 1.2.1"

# 2. 推送到 main
git push origin main

# 3. Release-please 會自動創建 release PR
# 4. 合併 release PR 後自動發布
```

### 場景 2: 多個修復累積後發布

```bash
# 1. 正常提交多個 fix
git commit -m "fix: 修復問題 A"
git commit -m "fix: 修復問題 B"
git commit -m "fix: 修復問題 C"

# 2. 在最後一個 commit 或新的 commit 中指定版本
git commit -m "chore: 準備發布

release-as: 1.2.1"

# 3. 推送到 main
git push origin main
```

### 場景 3: 手動觸發特定版本

如果需要跳過某些版本號或指定特定版本：

```bash
git commit -m "chore: 發布版本 1.2.5

release-as: 1.2.5"
```

## Release PR 流程

1. **自動創建/更新**
   - 每次 push 到 main 分支時，release-please 會檢查
   - 如果有符合的 commit，會創建或更新 release PR
   - PR 標題格式：`chore: release 1.2.1`

2. **Review 和合併**
   - 檢查 PR 中的版本號和 CHANGELOG 是否正確
   - 合併 release PR 到 main

3. **自動發布**
   - 合併後自動創建 Git tag
   - 創建 GitHub Release
   - 觸發 publish job 發布到 npm

## 檢查當前狀態

### 查看是否有待處理的 release PR

在 GitHub 上查看：
- 前往 Pull Requests 頁面
- 搜尋標題包含 "chore: release" 的 PR
- 或使用 GitHub CLI：

```bash
gh pr list --label "autorelease: pending"
```

### 查看當前追蹤的版本

```bash
cat .release-please-manifest.json
```

### 查看最近的符合 Conventional Commits 的提交

```bash
git log --oneline --grep="feat:\|fix:\|BREAKING" -10
```

### 驗證配置是否正確

檢查 workflow 是否正常運行：
1. 前往 GitHub Actions 頁面
2. 查看 "Release Please" workflow 的運行記錄
3. 確認是否有錯誤或警告

## 測試自動生成 PR

### 方法 1: 創建測試 commit

```bash
# 1. 創建一個符合規範的 commit
git commit -m "fix: 測試自動生成 release PR" --allow-empty

# 2. 推送到 main
git push origin main

# 3. 等待幾分鐘，檢查是否有新的 release PR 創建
```

### 方法 2: 檢查 GitHub Actions 日誌

1. 前往 `.github/workflows/release.yml` 的 Actions 頁面
2. 查看最新的 workflow run
3. 檢查 release-please job 的輸出
4. 確認是否有 "Created/Updated release PR" 的訊息

## 注意事項

1. **版本號必須遞增**
   - 不能指定比當前版本更低的版本號
   - 例如：當前是 1.2.0，不能指定 1.1.9

2. **release-as 的優先級**
   - `release-as` 指令會覆蓋自動計算的版本號
   - 如果有多個 `release-as`，使用最新的

3. **Conventional Commits 仍然重要**
   - 即使使用 `release-as`，建議仍然遵循 Conventional Commits
   - 這有助於生成正確的 CHANGELOG

4. **合併 release PR 後**
   - `.release-please-manifest.json` 會自動更新
   - 不需要手動修改

5. **如果沒有符合的 commit**
   - Release-please 不會創建 release PR
   - 這是正常行為，避免不必要的版本更新

## 範例：創建 Patch 版本

```bash
# 1. 修復問題
git commit -m "fix: 修復 OIDC 發布問題"

# 2. 指定 patch 版本（可選，如果不指定會自動計算）
git commit -m "chore: 準備發布

release-as: 1.2.1"

# 3. 推送到 main
git push origin main

# 4. 等待 release PR 創建（通常在幾分鐘內）
# 5. Review 並合併 release PR
# 6. 自動發布到 npm
```

## 故障排除

### 如果沒有自動生成 PR

1. **檢查是否有符合的 commit**
   ```bash
   git log --oneline --grep="feat:\|fix:\|BREAKING" -10
   ```

2. **檢查 GitHub Actions 是否運行**
   - 前往 Actions 頁面
   - 確認 workflow 有被觸發

3. **檢查配置檔案**
   - 確認 `release-please-config.json` 存在且格式正確
   - 確認 `.release-please-manifest.json` 存在

4. **檢查權限**
   - 確認 workflow 有 `pull-requests: write` 權限
   - 確認使用的 token 有足夠權限

5. **查看 workflow 日誌**
   - 檢查是否有錯誤訊息
   - 查看 release-please 的輸出
