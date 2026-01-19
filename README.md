# Ingress Streak Widget 🔵🟢
*For iOS Scriptable App*

這是一個專為 Ingress探員設計的 iOS 桌面小工具，幫助您輕鬆追蹤每日 Hack 連勝 (Sojourner) 紀錄與每週進度。

![Preview](src/ingress_bg.jpg)

## ✨ 功能特色
*   **視覺化週進度**: 透過 7 個圓圈直觀顯示本週 (週一至週日) 的 Hack 狀況。
*   **連勝天數統計**: 自動計算並顯示連續 Hack 的總天數。
*   **打卡狀態切換**: 每日打卡後，按鈕會自動變更為「已完成」樣式，避免重複開啟。
*   **雙陣營主題**: 支援 **Resistance (藍軍)** 與 **Enlightened (綠軍)** 專屬配色。
*   **活動日提醒**: 遇 First Saturday (FS) 或 Second Sunday (SS) 時，自動顯示活動專屬圖示。

## 🚀 安裝教學 (只要 30 秒)

### 1. 下載 Scriptable
請先前往 App Store 下載免費的 **[Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188)** App。

### 2. 執行安裝腳本
我們提供了一鍵安裝腳本，您不需要手動下載圖片或設定檔案。

1.  點擊此處打開 **[`installer.js`](installer.js)** 檔案。
2.  複製該檔案的所有程式碼。
3.  開啟 **Scriptable** App，點擊右上角的 `+` 號新增腳本。
4.  貼上程式碼，直接點擊右下角的 **執行 (▶️)** 按鈕。
5.  等待螢幕出現「🎉 安裝成功」的提示視窗。

### 3. 加入桌面小工具
1.  回到 iOS 主畫面，長按空白處進入編輯模式。
2.  點擊左上角 `+`，搜尋並選擇 **Scriptable**。
3.  選擇您喜歡的尺寸 (推薦 **中型** 或 **小型**)，加入桌面。
4.  **長按** 剛剛加入的小工具，選擇「編輯小工具」：
    *   **Script**: 選擇 `main`
    *   **Parameter**: 輸入您的陣營代碼
        *   輸入 `R` 代表 藍軍 (Resistance)
        *   輸入 `E` 代表 綠軍 (Enlightened)
    *   **When Interacting**: 選擇 `Run Script`

## 🕹️ 如何使用
*   **每日打卡**: 點擊小工具右側的按鈕，會自動開啟 Ingress 遊戲。
*   **確認狀態**: 再次回到桌面時，按鈕圖示會變更，且當天的圓圈會亮起，代表記錄成功。

---
*Ingress is a trademark of Niantic, Inc. This widget is a fan-made tool.*
