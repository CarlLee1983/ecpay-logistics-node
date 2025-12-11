# 如何自動觸發生成 Patch 版本 PR

## 自動觸發機制

當你提交符合 Conventional Commits 規範的 `fix:` commit 並推送到 `main` 分支時，release-please 會**自動**創建或更新 patch 版本的 release PR。

## 觸發條件

### ✅ 會自動觸發 Patch PR 的情況

1. **提交 `fix:` 類型的 commit**
   ```bash
   git commit -m "fix: 修復 OIDC 發布問題"
   git push origin main
   ```
   → 自動創建 `chore: release 1.2.1` 的 PR

2. **多個 `fix:` commit 累積**
   ```bash
   git commit -m "fix: 修復問題 A"
   git commit -m "fix: 修復問題 B"
   git push origin main
   ```
   → 自動創建 `chore: release 1.2.1` 的 PR（所有 fix 會合併到同一個 patch 版本）

3. **混合 `fix:` 和 `feat:` commit**
   ```bash
   git commit -m "fix: 修復問題"
   git commit -m "feat: 新增功能"
   git push origin main
   ```
   → 自動創建 `chore: release 1.3.0` 的 PR（feat 會觸發 minor 版本）

### ❌ 不會觸發的情況

1. **只有 `chore:` commit**
   ```bash
   git commit -m "chore: 更新配置"
   ```
   → 不會觸發版本更新

2. **只有 `docs:` commit**
   ```bash
   git commit -m "docs: 更新文件"
   ```
   → 不會觸發版本更新

3. **只有 `refactor:` commit**
   ```bash
   git commit -m "refactor: 重構程式碼"
   ```
   → 不會觸發版本更新（除非配置了）

## 完整流程範例

### 範例 1: 簡單的 Patch 修復

```bash
# 1. 修復問題
git commit -m "fix: 修復類型檢查錯誤"

# 2. 推送到 main
git push origin main

# 3. 等待幾分鐘（GitHub Actions 運行）
# 4. 自動創建 release PR: "chore: release 1.2.1"
# 5. Review 並合併 release PR
# 6. 自動發布到 npm
```

### 範例 2: 多個修復累積

```bash
# 1. 第一個修復
git commit -m "fix: 修復 OIDC 配置問題"

# 2. 第二個修復
git commit -m "fix: 修復類型定義錯誤"

# 3. 第三個修復
git commit -m "fix: 修復測試失敗"

# 4. 推送到 main
git push origin main

# 5. 自動創建 release PR: "chore: release 1.2.1"
#    （所有 fix 會合併到同一個 patch 版本）
```

### 範例 3: 指定特定 Patch 版本號

如果需要指定特定的版本號（例如跳過某些版本）：

```bash
# 1. 修復問題
git commit -m "fix: 修復重要問題"

# 2. 指定版本號
git commit -m "chore: 準備發布

release-as: 1.2.5"

# 3. 推送到 main
git push origin main

# 4. 自動創建 release PR: "chore: release 1.2.5"
```

## 檢查是否會觸發

### 方法 1: 檢查最近的 commit

```bash
# 查看最近的 fix commit
git log --oneline --grep="fix:" -10

# 查看自上次 release 後的 commit
git log --oneline 734b145..HEAD | grep -E "fix:|feat:"
```

### 方法 2: 查看當前版本

```bash
# 查看 manifest 中的版本
cat .release-please-manifest.json

# 查看 package.json 中的版本
grep '"version"' package.json
```

### 方法 3: 檢查 GitHub Actions

1. 前往 GitHub Actions 頁面
2. 查看 "Release Please" workflow
3. 檢查最新的運行記錄
4. 查看輸出中是否有 "Created release PR" 或 "Updated release PR"

## 驗證自動觸發

### 測試步驟

```bash
# 1. 創建一個測試 fix commit（不修改任何檔案）
git commit -m "fix: 測試自動生成 patch PR" --allow-empty

# 2. 推送到 main
git push origin main

# 3. 等待 1-2 分鐘

# 4. 檢查 GitHub 是否有新的 release PR
#    或使用 GitHub CLI:
gh pr list --search "chore: release"
```

### 預期結果

- ✅ 自動創建 PR，標題為 `chore: release 1.2.1`
- ✅ PR 中會更新 `package.json` 的版本號
- ✅ PR 中會更新 `CHANGELOG.md`
- ✅ PR 中會更新 `.release-please-manifest.json`

## 常見問題

### Q: 為什麼我提交了 fix 但沒有 PR？

**可能原因：**
1. **Workflow 還沒運行**：等待 1-2 分鐘
2. **Commit 格式不正確**：必須是 `fix: 描述` 格式
3. **已經有 release PR 存在**：會更新現有的 PR，而不是創建新的
4. **Workflow 執行失敗**：檢查 GitHub Actions 日誌

### Q: 如何強制創建新的 Patch PR？

如果已經有 release PR 但想創建新的：

```bash
# 方法 1: 關閉現有的 release PR，然後推送新的 fix
# 方法 2: 使用 release-as 指定版本號
git commit -m "fix: 修復問題

release-as: 1.2.2"
```

### Q: 可以跳過某些版本號嗎？

可以，使用 `release-as` 指令：

```bash
git commit -m "fix: 修復問題

release-as: 1.2.5"
```

### Q: 多個 fix 會創建多個 PR 嗎？

不會，多個 `fix:` commit 會合併到同一個 patch 版本。例如：
- fix A → 1.2.1
- fix B → 仍然是 1.2.1（不會變成 1.2.2）

只有當你合併 release PR 後，新的 fix 才會觸發下一個 patch 版本。

## 時間線範例

```
時間點 1: 當前版本 1.2.0
  ↓
時間點 2: 提交 fix A
  → 自動創建 PR: "chore: release 1.2.1"
  ↓
時間點 3: 提交 fix B（在 PR 合併前）
  → 更新現有 PR（仍然是 1.2.1）
  ↓
時間點 4: 合併 release PR
  → 發布 1.2.1 到 npm
  → manifest 更新為 1.2.1
  ↓
時間點 5: 提交 fix C
  → 自動創建新 PR: "chore: release 1.2.2"
```

## 總結

**自動觸發 Patch PR 的關鍵：**

1. ✅ 提交 `fix: 描述` 格式的 commit
2. ✅ 推送到 `main` 分支
3. ✅ 等待 GitHub Actions 運行（通常 1-2 分鐘）
4. ✅ 自動創建或更新 release PR

**不需要手動操作**，只要遵循 Conventional Commits 規範即可！

