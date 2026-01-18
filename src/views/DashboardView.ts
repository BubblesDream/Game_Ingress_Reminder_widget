import { WidgetView, ViewContext } from "./WidgetView";

export class DashboardView implements WidgetView {
    render(ctx: ViewContext) {
        const { widget, S, data, t, weeklyCount, images, files, getPath, isTodayChecked, faction, eventCode } = ctx;

        // --- 名言邏輯 ---
        let displayText = "";

        // 1. 活動日提示
        if (eventCode) {
            const eventQuotes = t("event_" + eventCode);
            if (Array.isArray(eventQuotes) && eventQuotes.length > 0) {
                displayText = eventQuotes[Math.floor(Math.random() * eventQuotes.length)];
            }
        }

        // 2. 一般名言
        if (!displayText) {
            let baseKey = isTodayChecked ? "quotes_after" : "quotes_before";
            let factionKey = (faction === "R" || faction === "E") ? `${baseKey}_${faction}` : baseKey;
            let quotesList = t(factionKey);
            if (!Array.isArray(quotesList)) quotesList = t(baseKey);

            if (Array.isArray(quotesList) && quotesList.length > 0) {
                displayText = quotesList[Math.floor(Math.random() * quotesList.length)];
            }
        }

        // --- UI 渲染 ---
        let rootStack = widget.addStack();
        rootStack.layoutVertically();
        rootStack.centerAlignContent();

        let dashboardStack = rootStack.addStack();
        dashboardStack.layoutHorizontally();
        dashboardStack.centerAlignContent();

        // (左欄)
        let leftStack = dashboardStack.addStack();
        leftStack.layoutVertically();

        // Header
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

        // Streak
        let streakStack = leftStack.addStack();
        streakStack.layoutHorizontally();
        streakStack.bottomAlignContent();
        let streakNum = streakStack.addText(data.streak.toString());
        streakNum.font = S.getFont("streak", "number_");
        streakNum.textColor = S.getColor("streak", "number_color");
        streakNum.minimumScaleFactor = 0.25; // Allow scaling down significantly
        streakNum.lineLimit = 1; // Force single line
        streakStack.addSpacer(4);
        let streakLabel = streakStack.addText(t("days_label"));
        streakLabel.font = S.getFont("streak", "label_");
        streakLabel.textColor = S.getColor("streak", "label_color");
        streakLabel.textOpacity = S.getNum("streak", "label_opacity", 1);
        streakStack.addSpacer(2);
        leftStack.addSpacer(6);

        // Weekly (7 circles)
        let weeklyStack = leftStack.addStack();
        weeklyStack.layoutHorizontally();
        weeklyStack.centerAlignContent();

        ctx.weeklyProgress.forEach((isHacked, index) => {
            let circleBox = weeklyStack.addStack();
            circleBox.size = new Size(18, 18);
            circleBox.cornerRadius = 9;
            circleBox.borderWidth = 1;

            // Style based on state
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

        // 分隔線
        let divider = dashboardStack.addStack();
        divider.size = new Size(S.getNum("divider", "width", 1), S.getNum("divider", "height", 70));
        divider.backgroundColor = S.getColor("divider", "color", S.getNum("divider", "opacity", 1));

        dashboardStack.addSpacer();

        // (右欄) 按鈕 - 【核心修復區域】
        let rightStack = dashboardStack.addStack();
        rightStack.centerAlignContent();

        const btnSize = S.getNum("button", "size", 80);
        const btnRadius = S.getNum("button", "corner_radius", 40);

        // 邏輯重寫：絕對優先權判斷
        let targetImgPath: string | null = null;

        // 優先權 1: 檢查是否有活動圖 (SS/FS)
        if (eventCode) {
            let evtPath = getPath(`ingress_button_${eventCode}.png`);
            if (files.fileExists(evtPath)) {
                targetImgPath = evtPath;
            }
        }

        // 優先權 2: 如果沒活動圖，才使用主程式傳來的 images.btn
        if (!targetImgPath) {
            let defaultPath = getPath(images.btn);
            if (files.fileExists(defaultPath)) {
                targetImgPath = defaultPath;
            }
        }

        // 渲染圖片或 Fallback
        if (targetImgPath) {
            let btn = rightStack.addImage(files.readImage(targetImgPath as string));
            btn.imageSize = new Size(btnSize, btnSize);
            btn.cornerRadius = btnRadius;
        } else {
            // 兩者都找不到，顯示 Fallback 色塊
            let fb = rightStack.addStack();
            fb.size = new Size(btnSize, btnSize);
            fb.cornerRadius = btnRadius;
            fb.backgroundColor = S.getColor("button", "fallback_bg");
            fb.centerAlignContent();
            let tBtn = fb.addText(t("hack_btn"));
            tBtn.textColor = S.getColor("button", "fallback_text_color");
            tBtn.font = Font.boldSystemFont(S.getNum("button", "fallback_font_size", 12));
        }

        // 下半部：提示區
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
}
