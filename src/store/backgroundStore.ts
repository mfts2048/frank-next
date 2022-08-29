import { ipcRenderer } from 'electron';
import { defineStore } from 'pinia';
import { CurrentSummoner } from '../../core/methods/getCurrentSummoner';

interface State {
    summoner: Partial<CurrentSummoner>;
}

export const useBackgroundStore = defineStore({
    id: 'background',
    state: (): State => {
        return {
            summoner: {}
        };
    },
    actions: {
        async getCurrentSummoner(): Promise<Partial<CurrentSummoner>> {
            if (this.summoner && this.summoner.summonerId) {
                return this.summoner;
            } else {
                const summoner = await ipcRenderer.invoke('get_current_summoner');
                this.setCurrentSummoner(summoner);
                return this.summoner;
            }
        },
        setCurrentSummoner(summoner: Partial<CurrentSummoner>) {
            this.summoner = summoner;
        }
    }
});
