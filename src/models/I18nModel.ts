export class I18nModel {
    private currentLang: any;
    private defaultLang = {
        "title": "INGRESS STREAK",
        "days_label": "DAYS",
        "weekly_prefix": "Weekly: ",
        "weekly_suffix": "",
        "hack_btn": "HACK"
    };

    constructor(files: FileManager, basePath: string) {
        this.currentLang = this.defaultLang;
        const sysLang = Device.language(); // e.g., "en", "zh-Hant"

        // Try specific (zh-Hant), then region (zh), then fallback (en)
        const candidates = [
            `i18n_${sysLang}.json`,
            `i18n_${sysLang.split('-')[0]}.json`,
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

    t(key: string): any {
        return this.currentLang[key] || (this.defaultLang as any)[key] || key;
    }
}
