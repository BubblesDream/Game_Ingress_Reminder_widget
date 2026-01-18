export class ThemeModel {
    private theme: any = {};
    private files: FileManager;

    constructor(files: FileManager, themePath: string, faction: string) {
        this.files = files;
        this.init(themePath, faction);
    }

    private init(path: string, faction: string) {
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

    getColor(group: string, key: string, opacity?: number): Color {
        const hex = this.theme[group]?.[key] || "#ffffff";
        const op = opacity !== undefined ? opacity : (this.theme[group]?.[key + "_opacity"] || 1);
        return new Color(hex, op);
    }

    getFont(group: string, prefix: string): Font {
        const name = this.theme[group]?.[prefix + "font_name"] || "systemFont";
        const size = this.theme[group]?.[prefix + "font_size"] || 12;

        // Scriptable doesn't let us dynamically access Font static methods easily in TS without index signature,
        // so we map them manually or use constructor.
        switch (name) {
            case "boldSystemFont": return Font.boldSystemFont(size);
            case "mediumSystemFont": return Font.mediumSystemFont(size);
            case "heavySystemFont": return Font.heavySystemFont(size);
            case "italicSystemFont": return Font.italicSystemFont(size);
            case "systemFont": return Font.systemFont(size);
            default: return new Font(name, size);
        }
    }

    getNum(group: string, key: string, defaultValue: number): number {
        return this.theme[group]?.[key] || defaultValue;
    }

    getString(group: string, key: string, defaultValue: string): string {
        return this.theme[group]?.[key] || defaultValue;
    }
}
