import { WidgetView, ViewContext } from "./WidgetView";

export class SmallView implements WidgetView {
    render(ctx: ViewContext) {
        const { widget, S, data, t, weeklyCount, images, files, getPath, factionColor } = ctx;

        let mainStack = widget.addStack();
        mainStack.layoutVertically();
        mainStack.centerAlignContent();

        // Header
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

        // Streak Number
        let numStack = mainStack.addStack();
        numStack.layoutHorizontally();
        numStack.addSpacer();
        let streakNum = numStack.addText(data.streak.toString());
        streakNum.font = new Font(S.getString("streak", "number_font_name", "AvenirNext-HeavyItalic"), 38);

        streakNum.textColor = Color.white();
        numStack.addSpacer();

        // Label
        let labelStack = mainStack.addStack();
        labelStack.layoutHorizontally();
        labelStack.addSpacer();
        let streakLabel = labelStack.addText(t("days_label"));
        streakLabel.font = S.getFont("streak", "label_");
        streakLabel.textColor = Color.white();
        streakLabel.textOpacity = 0.9;
        labelStack.addSpacer();

        mainStack.addSpacer(6);

        // Weekly (7 circles) - Compact for Small View
        let weeklyStack = mainStack.addStack();
        weeklyStack.layoutHorizontally();
        weeklyStack.centerAlignContent();

        ctx.weeklyProgress.forEach((isHacked, index) => {
            let circleBox = weeklyStack.addStack();
            circleBox.size = new Size(14, 14); // Smaller size for widget
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
            dayText.font = Font.boldSystemFont(8); // Smaller font
            dayText.textColor = isHacked ? Color.black() : inactiveColor;

            weeklyStack.addSpacer(3); // Tighter spacing
        });
    }
}
