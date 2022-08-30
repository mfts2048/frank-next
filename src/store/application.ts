import { defineStore } from 'pinia';

export interface Setting {
    autoAccept: boolean;
    autoBanChampion: {
        championId: string;
        isAuto: boolean;
    };
    autoPickChampion: {
        championId: string;
        isAuto: boolean;
    };
    gameDirectory: string;
}

const useApplication = defineStore('application', {
    state(): {
        setting: Partial<Setting>;
    } {
        return {
            setting: {}
        };
    }
});

export { useApplication };
