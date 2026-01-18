# iOS Scriptable Project

這是一個使用 TypeScript 開發的 Scriptable 專案。

## 專案結構
- `src/main.ts`: 程式進入點 (Entry Point)
- `dist/main.js`: 編譯後的 JavaScript 檔案 (部署用)
- `.agent/workflows`: Antigravity 自動化工作流

## 快速開始

1. **安裝依賴**
   使用 Antigravity `/setup` 指令或執行:
   ```bash
   npm install
   ```

2. **編譯**
   使用 Antigravity `/build_deploy` 指令或執行:
   ```bash
   npm run build
   ```
   產生的檔案位於 `dist/main.js`。

3. **開發**
   啟動監聽模式，修改程式碼後自動編譯:
   ```bash
   npm run watch
   ```

## 部署至 iOS
1. 確保您的 Windows 已安裝 iCloud for Windows 並啟用 iCloud Drive。
2. 將 `dist/main.js` 複製到 iCloud Drive 中的 `Scriptable` 資料夾。
3. 在 iOS 上的 Scriptable App 中即可看到該腳本。

## 除錯 (Debugging)
- Scriptable 不支援傳統的中斷點除錯。
- 建議使用 `console.log()` 輸出訊息 (可以在 Scriptable App 的 Log 視窗查看)。
- 可以在 `src/main.ts` 中使用 `args.widgetParameter` 來模擬小工具參數。
- 若要在電腦上初步驗證邏輯，可將與 iOS 特定 API 無關的邏輯抽離成純函數進行單元測試。

## 資源
- [Scriptable Docs](https://docs.scriptable.app/)
