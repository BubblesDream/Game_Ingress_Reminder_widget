// ==========================================
// 🚀 INGRESS STREAK WIDGET (MVC Refactored)
// ==========================================

import { StreakModel } from "./models/StreakModel";
import { EventModel } from "./models/EventModel";
import { ThemeModel } from "./models/ThemeModel";
import { I18nModel } from "./models/I18nModel";
import { SmallView } from "./views/SmallView";
import { DashboardView } from "./views/DashboardView";
import { ViewContext } from "./views/WidgetView";

const bookmarkName = "IngressRepo";
const fileNames = { data: "ingress_history.json", theme: "theme.json" };
const images = { logo: "ingress_logo.png", bg: "ingress_bg.jpg", btn: "ingress_button.png" };
const appUrl = "ingress://";

async function main() {
  // === 1. 初始化 ===
  const files = FileManager.local();
  if (!files.bookmarkExists(bookmarkName)) {
    throw new Error(`書籤遺失: ${bookmarkName}`);
  }
  const dir = files.bookmarkedPath(bookmarkName);
  const getPath = (file: string) => files.joinPath(dir, file);

  // Initialize Models
  const streakModel = new StreakModel(files, getPath(fileNames.data));
  const i18nModel = new I18nModel(files, dir);

  // === 2. 處理參數 & 活動檢測 ===
  const param = (args.widgetParameter || "").trim().toUpperCase();
  let faction = "N";
  if (param === "R") faction = "R";
  if (param === "E") faction = "E";

  const finalImages = { ...images };
  if (faction === "R") finalImages.logo = "ingress_logo_R.png";
  if (faction === "E") finalImages.logo = "ingress_logo_E.png";

  const themeModel = new ThemeModel(files, getPath(fileNames.theme), faction);
  const eventCode = EventModel.getEvent();

  // === 3. 業務邏輯 (Controller Action) ===
  const weeklyCount = streakModel.getWeeklyCount();
  const isTodayChecked = streakModel.isTodayChecked();

  if (config.runsInApp) {
    if (!isTodayChecked) {
      streakModel.checkIn();
    }
    Safari.open(appUrl);
    return;
  }

  // === 4. UI 渲染 (View Selection) ===
  if (config.runsInWidget) {
    const widget = new ListWidget();

    // Background Setup
    const S = themeModel;
    const bgPath = getPath(finalImages.bg);

    widget.backgroundColor = S.getColor("global", "background_color");
    if (files.fileExists(bgPath)) {
      widget.backgroundImage = files.readImage(bgPath);
      widget.backgroundColor = S.getColor("global", "background_overlay", S.getNum("global", "background_opacity", 1));
    }

    const factionColor = S.getColor("header", "text_color");
    const data = streakModel.getData();
    const t = (k: string) => i18nModel.t(k);

    const context: ViewContext = {
      widget,
      S,
      data,
      t,
      weeklyCount,
      images: finalImages,
      files,
      getPath,
      isTodayChecked,
      faction,
      factionColor,
      eventCode
    };

    if (config.widgetFamily === "small") {
      new SmallView().render(context);
    } else {
      new DashboardView().render(context);
    }

    Script.setWidget(widget);
  }
  Script.complete();
}

main().catch(console.error);
