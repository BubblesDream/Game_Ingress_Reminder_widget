import { StreakData } from "../models/StreakModel";
import { ThemeModel } from "../models/ThemeModel";

export interface ViewContext {
    widget: ListWidget;
    S: ThemeModel;
    data: StreakData;
    t: (k: string) => any;
    weeklyCount: number;
    images: { logo: string; bg: string; btn: string };
    files: FileManager;
    getPath: (f: string) => string;
    isTodayChecked: boolean;
    faction: string;
    factionColor: Color;
    eventCode: string | null;
}

export interface WidgetView {
    render(ctx: ViewContext): void;
}
