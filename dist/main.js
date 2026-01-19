"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/models/StreakModel.ts
  var StreakModel;
  var init_StreakModel = __esm({
    "src/models/StreakModel.ts"() {
      "use strict";
      StreakModel = class {
        constructor(files, filePath) {
          __publicField(this, "files");
          __publicField(this, "filePath");
          __publicField(this, "data");
          this.files = files;
          this.filePath = filePath;
          this.data = { streak: 0, lastDate: "", history: [] };
          this.load();
        }
        load() {
          if (this.files.fileExists(this.filePath)) {
            try {
              this.data = JSON.parse(this.files.readString(this.filePath));
            } catch (e) {
              console.error("Failed to load streak data: " + e);
            }
          }
        }
        save() {
          this.files.writeString(this.filePath, JSON.stringify(this.data));
        }
        getLocalDateStr(dateObj) {
          const d = dateObj || /* @__PURE__ */ new Date();
          const year = d.getFullYear();
          const month = ("0" + (d.getMonth() + 1)).slice(-2);
          const day = ("0" + d.getDate()).slice(-2);
          return `${year}-${month}-${day}`;
        }
        getWeeklyCount() {
          if (!this.data.history?.length) return 0;
          const now = /* @__PURE__ */ new Date();
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const day = d.getDay();
          const diff = d.getDate() - day + (day === 0 ? -6 : 1);
          const mondayDate = new Date(d.setDate(diff));
          const mondayStr = this.getLocalDateStr(mondayDate);
          return this.data.history.filter((dt) => dt >= mondayStr).length;
        }
        isTodayChecked() {
          const todayStr = this.getLocalDateStr();
          return this.data.lastDate === todayStr;
        }
        checkIn() {
          const todayStr = this.getLocalDateStr();
          if (this.data.lastDate === todayStr) return;
          const y = /* @__PURE__ */ new Date();
          y.setDate(y.getDate() - 1);
          const yesterdayStr = this.getLocalDateStr(y);
          this.data.streak = this.data.lastDate === yesterdayStr ? this.data.streak + 1 : 1;
          this.data.lastDate = todayStr;
          this.data.history.push(todayStr);
          if (this.data.history.length > 14) {
            this.data.history = this.data.history.slice(-14);
          }
          this.save();
        }
        getWeeklyProgress() {
          const now = /* @__PURE__ */ new Date();
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const day = d.getDay();
          const diff = d.getDate() - day + (day === 0 ? -6 : 1);
          const progress = [];
          for (let i = 0; i < 7; i++) {
            const currentDay = new Date(d);
            currentDay.setDate(diff + i);
            const dateStr = this.getLocalDateStr(currentDay);
            progress.push(this.data.history.includes(dateStr));
          }
          return progress;
        }
        getData() {
          return this.data;
        }
      };
    }
  });

  // src/models/EventModel.ts
  var EventModel;
  var init_EventModel = __esm({
    "src/models/EventModel.ts"() {
      "use strict";
      EventModel = class {
        static getEvent() {
          const d = /* @__PURE__ */ new Date();
          const day = d.getDay();
          const date = d.getDate();
          if (day === 6 && date <= 7) {
            return "FS";
          }
          if (day === 0 && date > 7 && date <= 14) {
            return "SS";
          }
          return null;
        }
      };
    }
  });

  // src/models/ThemeModel.ts
  var ThemeModel;
  var init_ThemeModel = __esm({
    "src/models/ThemeModel.ts"() {
      "use strict";
      ThemeModel = class {
        constructor(files, themePath, faction) {
          __publicField(this, "theme", {});
          __publicField(this, "files");
          this.files = files;
          this.init(themePath, faction);
        }
        init(path, faction) {
          if (this.files.fileExists(path)) {
            try {
              this.theme = JSON.parse(this.files.readString(path));
            } catch (e) {
              console.error("Theme load error: " + e);
            }
          }
          const factionColors = this.theme.faction_color;
          if (factionColors && factionColors[faction]) {
            const activeColor = factionColors[faction];
            if (!this.theme.header) this.theme.header = {};
            this.theme.header.text_color = activeColor;
            if (!this.theme.button) this.theme.button = {};
            this.theme.button.fallback_bg = activeColor;
          }
        }
        getColor(group, key, opacity) {
          const hex = this.theme[group]?.[key] || "#ffffff";
          const op = opacity !== void 0 ? opacity : this.theme[group]?.[key + "_opacity"] || 1;
          return new Color(hex, op);
        }
        getFont(group, prefix) {
          const name = this.theme[group]?.[prefix + "font_name"] || "systemFont";
          const size = this.theme[group]?.[prefix + "font_size"] || 12;
          switch (name) {
            case "boldSystemFont":
              return Font.boldSystemFont(size);
            case "mediumSystemFont":
              return Font.mediumSystemFont(size);
            case "heavySystemFont":
              return Font.heavySystemFont(size);
            case "italicSystemFont":
              return Font.italicSystemFont(size);
            case "systemFont":
              return Font.systemFont(size);
            default:
              return new Font(name, size);
          }
        }
        getNum(group, key, defaultValue) {
          return this.theme[group]?.[key] || defaultValue;
        }
        getString(group, key, defaultValue) {
          return this.theme[group]?.[key] || defaultValue;
        }
      };
    }
  });

  // src/models/I18nModel.ts
  var I18nModel;
  var init_I18nModel = __esm({
    "src/models/I18nModel.ts"() {
      "use strict";
      I18nModel = class {
        constructor(files, basePath) {
          __publicField(this, "currentLang");
          __publicField(this, "defaultLang", {
            "title": "INGRESS STREAK",
            "days_label": "DAYS",
            "weekly_prefix": "Weekly: ",
            "weekly_suffix": "",
            "hack_btn": "HACK"
          });
          this.currentLang = this.defaultLang;
          const sysLang = Device.language();
          const candidates = [
            `i18n_${sysLang}.json`,
            `i18n_${sysLang.split("-")[0]}.json`,
            `i18n_en.json`
          ];
          for (const filename of candidates) {
            const p = files.joinPath(basePath, filename);
            if (files.fileExists(p)) {
              try {
                this.currentLang = JSON.parse(files.readString(p));
                break;
              } catch (e) {
                console.error(`Failed to parse ${filename}: ${e}`);
              }
            }
          }
        }
        t(key) {
          return this.currentLang[key] || this.defaultLang[key] || key;
        }
      };
    }
  });

  // src/views/SmallView.ts
  var SmallView;
  var init_SmallView = __esm({
    "src/views/SmallView.ts"() {
      "use strict";
      SmallView = class {
        render(ctx) {
          const { widget, S, data, t, weeklyCount, images, files, getPath, factionColor } = ctx;
          let mainStack = widget.addStack();
          mainStack.layoutVertically();
          mainStack.centerAlignContent();
          let headerStack = mainStack.addStack();
          headerStack.layoutHorizontally();
          headerStack.centerAlignContent();
          headerStack.addSpacer();
          const logoPath = getPath(images.logo);
          if (files.fileExists(logoPath)) {
            let logo = headerStack.addImage(files.readImage(logoPath));
            logo.imageSize = new Size(14, 14);
            headerStack.addSpacer(4);
          }
          let title = headerStack.addText("INGRESS");
          title.font = Font.boldSystemFont(10);
          title.textColor = factionColor;
          headerStack.addSpacer();
          mainStack.addSpacer(6);
          let numStack = mainStack.addStack();
          numStack.layoutHorizontally();
          numStack.addSpacer();
          let streakNum = numStack.addText(data.streak.toString());
          streakNum.font = new Font(S.getString("streak", "number_font_name", "AvenirNext-HeavyItalic"), 38);
          streakNum.textColor = Color.white();
          numStack.addSpacer();
          let labelStack = mainStack.addStack();
          labelStack.layoutHorizontally();
          labelStack.addSpacer();
          let streakLabel = labelStack.addText(t("days_label"));
          streakLabel.font = S.getFont("streak", "label_");
          streakLabel.textColor = Color.white();
          streakLabel.textOpacity = 0.9;
          labelStack.addSpacer();
          mainStack.addSpacer(6);
          let weeklyStack = mainStack.addStack();
          weeklyStack.layoutHorizontally();
          weeklyStack.centerAlignContent();
          ctx.weeklyProgress.forEach((isHacked, index) => {
            let circleBox = weeklyStack.addStack();
            circleBox.size = new Size(14, 14);
            circleBox.cornerRadius = 7;
            circleBox.borderWidth = 1;
            const activeColor = S.getColor("streak", "number_color");
            const inactiveColor = S.getColor("streak", "circle_inactive_color", S.getNum("streak", "circle_inactive_opacity", 0.4));
            if (isHacked) {
              circleBox.backgroundColor = activeColor;
              circleBox.borderColor = activeColor;
            } else {
              circleBox.borderColor = inactiveColor;
            }
            circleBox.centerAlignContent();
            let dayText = circleBox.addText((index + 1).toString());
            dayText.font = Font.boldSystemFont(8);
            dayText.textColor = isHacked ? Color.black() : inactiveColor;
            weeklyStack.addSpacer(3);
          });
        }
      };
    }
  });

  // src/views/DashboardView.ts
  var DashboardView;
  var init_DashboardView = __esm({
    "src/views/DashboardView.ts"() {
      "use strict";
      DashboardView = class {
        render(ctx) {
          const { widget, S, data, t, weeklyCount, images, files, getPath, isTodayChecked, faction, eventCode } = ctx;
          let displayText = "";
          if (eventCode) {
            const eventQuotes = t("event_" + eventCode);
            if (Array.isArray(eventQuotes) && eventQuotes.length > 0) {
              displayText = eventQuotes[Math.floor(Math.random() * eventQuotes.length)];
            }
          }
          if (!displayText) {
            let baseKey = isTodayChecked ? "quotes_after" : "quotes_before";
            let factionKey = faction === "R" || faction === "E" ? `${baseKey}_${faction}` : baseKey;
            let quotesList = t(factionKey);
            if (!Array.isArray(quotesList)) quotesList = t(baseKey);
            if (Array.isArray(quotesList) && quotesList.length > 0) {
              displayText = quotesList[Math.floor(Math.random() * quotesList.length)];
            }
          }
          let rootStack = widget.addStack();
          rootStack.layoutVertically();
          rootStack.centerAlignContent();
          let dashboardStack = rootStack.addStack();
          dashboardStack.layoutHorizontally();
          dashboardStack.centerAlignContent();
          let leftStack = dashboardStack.addStack();
          leftStack.layoutVertically();
          let headerStack = leftStack.addStack();
          headerStack.layoutHorizontally();
          headerStack.centerAlignContent();
          const logoPath = getPath(images.logo);
          if (files.fileExists(logoPath)) {
            let logo = headerStack.addImage(files.readImage(logoPath));
            let size = S.getNum("header", "logo_size", 16);
            logo.imageSize = new Size(size, size);
            headerStack.addSpacer(6);
          }
          let title = headerStack.addText(t("title"));
          title.font = S.getFont("header", "");
          title.textColor = S.getColor("header", "text_color");
          leftStack.addSpacer(4);
          let streakStack = leftStack.addStack();
          streakStack.layoutHorizontally();
          streakStack.bottomAlignContent();
          let streakNum = streakStack.addText(data.streak.toString());
          streakNum.font = S.getFont("streak", "number_");
          streakNum.textColor = S.getColor("streak", "number_color");
          streakNum.minimumScaleFactor = 0.25;
          streakNum.lineLimit = 1;
          streakStack.addSpacer(4);
          let streakLabel = streakStack.addText(t("days_label"));
          streakLabel.font = S.getFont("streak", "label_");
          streakLabel.textColor = S.getColor("streak", "label_color");
          streakLabel.textOpacity = S.getNum("streak", "label_opacity", 1);
          streakStack.addSpacer(2);
          leftStack.addSpacer(6);
          let weeklyStack = leftStack.addStack();
          weeklyStack.layoutHorizontally();
          weeklyStack.centerAlignContent();
          ctx.weeklyProgress.forEach((isHacked, index) => {
            let circleBox = weeklyStack.addStack();
            circleBox.size = new Size(18, 18);
            circleBox.cornerRadius = 9;
            circleBox.borderWidth = 1;
            const activeColor = S.getColor("streak", "number_color");
            const inactiveColor = S.getColor("streak", "circle_inactive_color", S.getNum("streak", "circle_inactive_opacity"));
            if (isHacked) {
              circleBox.backgroundColor = activeColor;
              circleBox.borderColor = activeColor;
            } else {
              circleBox.borderColor = inactiveColor;
            }
            circleBox.centerAlignContent();
            let dayText = circleBox.addText((index + 1).toString());
            dayText.font = Font.boldSystemFont(10);
            dayText.textColor = isHacked ? Color.black() : inactiveColor;
            weeklyStack.addSpacer(4);
          });
          dashboardStack.addSpacer();
          let divider = dashboardStack.addStack();
          divider.size = new Size(S.getNum("divider", "width", 1), S.getNum("divider", "height", 70));
          divider.backgroundColor = S.getColor("divider", "color", S.getNum("divider", "opacity", 1));
          dashboardStack.addSpacer();
          let rightStack = dashboardStack.addStack();
          rightStack.centerAlignContent();
          const btnSize = S.getNum("button", "size", 80);
          const btnRadius = S.getNum("button", "corner_radius", 40);
          let targetImgPath = null;
          if (isTodayChecked) {
            let afterPath = getPath("ingress_button_after.png");
            if (files.fileExists(afterPath)) {
              targetImgPath = afterPath;
            }
          }
          if (!targetImgPath && eventCode) {
            let evtPath = getPath(`ingress_button_${eventCode}.png`);
            if (files.fileExists(evtPath)) {
              targetImgPath = evtPath;
            }
          }
          if (!targetImgPath) {
            let defaultPath = getPath(images.btn);
            if (files.fileExists(defaultPath)) {
              targetImgPath = defaultPath;
            }
          }
          if (targetImgPath) {
            let btn = rightStack.addImage(files.readImage(targetImgPath));
            btn.imageSize = new Size(btnSize, btnSize);
            btn.cornerRadius = btnRadius;
          } else {
            let fb = rightStack.addStack();
            fb.size = new Size(btnSize, btnSize);
            fb.cornerRadius = btnRadius;
            fb.backgroundColor = S.getColor("button", "fallback_bg");
            fb.centerAlignContent();
            let tBtn = fb.addText(t("hack_btn"));
            tBtn.textColor = S.getColor("button", "fallback_text_color");
            tBtn.font = Font.boldSystemFont(S.getNum("button", "fallback_font_size", 12));
          }
          if (displayText) {
            rootStack.addSpacer(8);
            let quoteStack = rootStack.addStack();
            quoteStack.layoutHorizontally();
            quoteStack.addSpacer();
            let qText = quoteStack.addText(displayText);
            qText.font = S.getFont("quote", "");
            qText.textColor = eventCode ? new Color("#ffce00") : S.getColor("quote", "text_color");
            qText.textOpacity = S.getNum("quote", "opacity", 0.7);
            qText.centerAlignText();
            quoteStack.addSpacer();
          }
        }
      };
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_StreakModel();
      init_EventModel();
      init_ThemeModel();
      init_I18nModel();
      init_SmallView();
      init_DashboardView();
      var bookmarkName = "IngressRepo";
      var fileNames = { data: "ingress_history.json", theme: "theme.json" };
      var images = { logo: "ingress_logo.png", bg: "ingress_bg.jpg", btn: "ingress_button.png" };
      var appUrl = "ingress://";
      async function main() {
        const files = FileManager.local();
        if (!files.bookmarkExists(bookmarkName)) {
          throw new Error(`\u66F8\u7C64\u907A\u5931: ${bookmarkName}`);
        }
        const dir = files.bookmarkedPath(bookmarkName);
        const getPath = (file) => files.joinPath(dir, file);
        const streakModel = new StreakModel(files, getPath(fileNames.data));
        const i18nModel = new I18nModel(files, dir);
        const param = (args.widgetParameter || "").trim().toUpperCase();
        let faction = "N";
        if (param === "R") faction = "R";
        if (param === "E") faction = "E";
        const finalImages = { ...images };
        if (faction === "R") finalImages.logo = "ingress_logo_R.png";
        if (faction === "E") finalImages.logo = "ingress_logo_E.png";
        const themeModel = new ThemeModel(files, getPath(fileNames.theme), faction);
        const eventCode = EventModel.getEvent();
        const weeklyCount = streakModel.getWeeklyCount();
        const weeklyProgress = streakModel.getWeeklyProgress();
        const isTodayChecked = streakModel.isTodayChecked();
        if (config.runsInApp) {
          if (!isTodayChecked) {
            streakModel.checkIn();
          }
          Safari.open(appUrl);
          return;
        }
        if (config.runsInWidget) {
          const widget = new ListWidget();
          const S = themeModel;
          const bgPath = getPath(finalImages.bg);
          widget.backgroundColor = S.getColor("global", "background_color");
          if (files.fileExists(bgPath)) {
            widget.backgroundImage = files.readImage(bgPath);
            widget.backgroundColor = S.getColor("global", "background_overlay", S.getNum("global", "background_opacity", 1));
          }
          const factionColor = S.getColor("header", "text_color");
          const data = streakModel.getData();
          const t = (k) => i18nModel.t(k);
          const context = {
            widget,
            S,
            data,
            t,
            weeklyCount,
            weeklyProgress,
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
    }
  });
  require_main();
})();
