// ==========================================
// 🚀 INGRESS WIDGET INSTALLER
// ==========================================
// 使用說明：
// 1. 修改下方的 GITHUB_USER 和 REPO_NAME 為您的 GitHub 帳號與專案名稱。
// 2. 複製此腳本全部內容。
// 3. 在 Scriptable 新增一個 Script，貼上並執行即可。
// ==========================================

const GITHUB_USER = "BubblesDream";
const REPO_NAME = "Game_Ingress_Reminder_widget";
const BRANCH = "master";

const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}`;

// 需要下載的檔案清單
// remote: GitHub 上相對於專案根目錄的路徑
// local: 手機 IngressRepo 資料夾內的檔案名稱
const FILES = [
    // 主程式
    { remote: "dist/main.js", local: "main.js" },

    // 設定檔
    { remote: "src/theme.json", local: "theme.json" },
    { remote: "src/i18n_zh.json", local: "i18n_zh.json" },
    { remote: "src/i18n_en.json", local: "i18n_en.json" },
    { remote: "src/i18n_ja.json", local: "i18n_ja.json" },

    // 圖片資產
    { remote: "src/ingress_logo.png", local: "ingress_logo.png" },
    { remote: "src/ingress_logo_E.png", local: "ingress_logo_E.png" },
    { remote: "src/ingress_logo_R.png", local: "ingress_logo_R.png" },
    { remote: "src/ingress_bg.jpg", local: "ingress_bg.jpg" },

    // 按鈕資產
    { remote: "src/ingress_button.png", local: "ingress_button.png" },
    { remote: "src/ingress_button_after.png", local: "ingress_button_after.png" },
    { remote: "src/ingress_button_FS.png", local: "ingress_button_FS.png" },
    { remote: "src/ingress_button_SS.png", local: "ingress_button_SS.png" }
];

async function main() {
    // 智慧判斷儲存位置：優先嘗試 iCloud，若失敗則回退到 Local
    let fm;
    let locationName = "";
    try {
        fm = FileManager.iCloud();
        fm.documentsDirectory(); // 測試存取權限
        locationName = "iCloud Drive > Scriptable";
    } catch (e) {
        fm = FileManager.local();
        locationName = "我的 iPhone > Scriptable";
    }

    const bookmarkName = "IngressRepo";

    console.log(`🚀 開始安裝 Ingress Widget...`);
    console.log(`📂 目標位置: ${locationName} > ${bookmarkName}`);
    console.log(`📂 資料來源: ${BASE_URL}`);

    // 1. 檢查並建立資料夾
    let dir = "";
    if (fm.bookmarkExists(bookmarkName)) {
        dir = fm.bookmarkedPath(bookmarkName);
        console.log(`✅ 找到書籤: ${dir}`);
    } else {
        // 建立在 Documents/IngressRepo
        dir = fm.joinPath(fm.documentsDirectory(), bookmarkName);
        if (!fm.isDirectory(dir)) {
            fm.createDirectory(dir);
            console.log(`✅ 建立目錄: ${dir}`);
        }
    }

    // 2. 下載檔案
    let successCount = 0;
    let failCount = 0;
    let errors = [];

    const progressAlert = new Alert();
    progressAlert.title = "下載中...";
    progressAlert.message = "正在從 GitHub 抓取最新檔案";
    // Alert 無法非同步顯示進度條，僅作提示

    for (let file of FILES) {
        let url = `${BASE_URL}/${file.remote}`;
        let localPath = fm.joinPath(dir, file.local);

        console.log(`⬇️ 下載: ${file.local}`);

        try {
            let req = new Request(url);
            let content = await req.load();
            fm.write(localPath, content);
            successCount++;
            console.log(`   OK`);
        } catch (e) {
            failCount++;
            errors.push(file.local);
            console.error(`   Failed: ${e}`);
        }
    }

    // 3. 結果報告
    let msg = `成功: ${successCount}\n失敗: ${failCount}`;
    if (failCount > 0) {
        msg += `\n失敗檔案:\n${errors.join("\n")}`;
        msg += `\n\n檢查 GitHub URL 是否正確，或檔案是否已上傳。`;
    } else {
        msg += `\n\n安裝完成！ 🎉\n檔案位置：${locationName} > ${bookmarkName}\n\n請在桌面新增 Scriptable Widget 並指向 main.js`;
    }

    let alert = new Alert();
    alert.title = failCount === 0 ? "🎉 安裝成功" : "⚠️ 安裝完成但有錯誤";
    alert.message = msg;
    alert.addAction("好");
    await alert.present();
}

await main();
