import { BrowserWindow, ipcMain } from 'electron';
import { setupLcuServer } from './lcuServer';
import { CurrentSummoner } from './methods/getCurrentSummoner';
import { createWebsocketLcuEvent } from './wsLcuEvent';

async function bootstrap(win: BrowserWindow) {
    const lcuServer = await setupLcuServer();
    let summoner: CurrentSummoner;

    ipcMain.handle('get_champion_mastery', (event, { summonerId }) => {
        return lcuServer.getChampionMastery(summonerId);
    });

    ipcMain.handle('get_current_summoner', async () => {
        summoner = await lcuServer.getCurrentSummoner();
        return summoner;
    });

    ipcMain.handle('get_match_history', async (event, { summonerId, begIndex, endIndex }) => {
        return await lcuServer.getMatchHistory(summonerId, begIndex, endIndex);
    });

    ipcMain.handle('set_rune_page', async (event, { data }) => {
        return await lcuServer.setRunePage(data);
    });

    await createWebsocketLcuEvent(win, lcuServer);
}

export default bootstrap;
