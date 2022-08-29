import { BrowserWindow, ipcMain } from 'electron';
import { LcuServerCore, setupLcuServer } from './lcuServer';
import { createWebsocketLcuEvent } from './wsLcuEvent';
import { CurrentSummoner } from './methods/getCurrentSummoner';

async function bootstrap(win: BrowserWindow) {
    let lcuServer: LcuServerCore = await setupLcuServer();

    if (!lcuServer.credentials) {
        // win.webContents.send('check_league_client_is_running', false);

        ipcMain.handle('check_league_client_is_running', async () => {
            return false;
        });
        return;
    }
    // win.webContents.send('check_league_client_is_running', true);

    ipcMain.handle('check_league_client_is_running', async () => {
        return true;
    });

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

    ipcMain.handle('get_profile_summary', async (event, { puuid }) => {
        return await lcuServer.getProfileSummary(puuid);
    });

    await createWebsocketLcuEvent(win, lcuServer);
}

export default bootstrap;
