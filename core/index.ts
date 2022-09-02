import { app, BrowserWindow, ipcMain } from 'electron';
import { LcuServerCore, setupLcuServer } from './lcuServer';
import { createWebsocketLcuEvent } from './wsLcuEvent';
import { CurrentSummoner } from './methods/getCurrentSummoner';
import { appSetting } from './constant/setting';
import { startClient } from './methods/startGame';

async function bootstrap(win: BrowserWindow) {
    let lcuServer: LcuServerCore = await setupLcuServer();

    ipcMain.handle('start_client', async () => {
        const result = await startClient();

        if (result) {
            await nextStep(win, lcuServer);
        }

        return result;
    });

    ipcMain.handle('get_app_setting', () => {
        return appSetting.store;
    });

    ipcMain.handle('set_app_setting', (event, { key, value }) => {
        appSetting.set(key, value);
    });

    ipcMain.handle('check_league_client_is_running', async () => {
        return Boolean(lcuServer.credentials);
    });

    // 既然无法获取到客户端的任何数据，那么下面就不用执行了
    // if (!lcuServer.credentials) return;
    // console.log('？？？')
    nextStep(win, lcuServer);
}

// 一下方法都是需要在用户成功打开客户端的情况下才能继续执行，保证代码效率
const nextStep = async (win: BrowserWindow, lcuServer: LcuServerCore) => {
    console.log(888)
    let summoner: CurrentSummoner;

    ipcMain.handle('get_champion_mastery', (event, { summonerId }) => {
        return lcuServer.getChampionMastery(summonerId);
    });

    ipcMain.handle('get_current_summoner', async () => {
        console.log(123)
        summoner = await lcuServer.getCurrentSummoner();
        console.log(789798)
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
};

export default bootstrap;
