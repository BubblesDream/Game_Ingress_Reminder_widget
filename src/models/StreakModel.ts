export interface StreakData {
    streak: number;
    lastDate: string;
    history: string[];
}

export class StreakModel {
    private files: FileManager;
    private filePath: string;
    private data: StreakData;

    constructor(files: FileManager, filePath: string) {
        this.files = files;
        this.filePath = filePath;
        this.data = { streak: 0, lastDate: "", history: [] };
        this.load();
    }

    private load() {
        if (this.files.fileExists(this.filePath)) {
            try {
                this.data = JSON.parse(this.files.readString(this.filePath));
            } catch (e) {
                console.error("Failed to load streak data: " + e);
            }
        }
    }

    private save() {
        this.files.writeString(this.filePath, JSON.stringify(this.data));
    }

    getLocalDateStr(dateObj?: Date): string {
        const d = dateObj || new Date();
        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    getWeeklyCount(): number {
        if (!this.data.history?.length) return 0;
        const now = new Date();
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        const mondayDate = new Date(d.setDate(diff));
        const mondayStr = this.getLocalDateStr(mondayDate);
        return this.data.history.filter((dt) => dt >= mondayStr).length;
    }

    isTodayChecked(): boolean {
        const todayStr = this.getLocalDateStr();
        return this.data.lastDate === todayStr;
    }

    checkIn() {
        const todayStr = this.getLocalDateStr();
        if (this.data.lastDate === todayStr) return; // Already checked in

        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yesterdayStr = this.getLocalDateStr(y);

        this.data.streak = (this.data.lastDate === yesterdayStr) ? this.data.streak + 1 : 1;
        this.data.lastDate = todayStr;
        this.data.history.push(todayStr);

        if (this.data.history.length > 14) {
            this.data.history = this.data.history.slice(-14);
        }
        this.save();
    }

    getWeeklyProgress(): boolean[] {
        const now = new Date();
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday

        const progress: boolean[] = [];

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(d);
            currentDay.setDate(diff + i);
            const dateStr = this.getLocalDateStr(currentDay);
            progress.push(this.data.history.includes(dateStr));
        }

        return progress;
    }

    getData(): StreakData {
        return this.data;
    }
}
