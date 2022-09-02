import { BrowserWindow } from 'electron';
import { LcuServerCore } from './lcuServer';
import { createWebSocketConnection } from './league-connect';
import { wssListenConsole } from './utils/console';
import { translate } from './utils/translate';
import { throttle } from 'lodash-es';
import { appSetting } from './constant/setting';
import { http1Request } from './utils/request';

export async function createWebsocketLcuEvent(win: BrowserWindow, lcuServer: LcuServerCore) {
    const ws = await createWebSocketConnection({
        authenticationOptions: {},
        pollInterval: 1000
    });

    if (!ws) return;

    // 玩家状态订阅
    ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data, event) => {
        wssListenConsole(`/lol-gameflow/v1/gameflow-phase => ${translate('status', data)}`);

        // 状态转发到渲染进程主窗口
        win.webContents.send('game_status_change', {
            status: data,
            statusName: translate('status', data)
        });

        if (data === 'ChampSelect') {
            // nothing
            // 监听用户的操作 （每次触发三次）
            // 所以这地地方使用节流的方式，并且第一次不执行，使用时间段内最后一次
            ws.subscribe('/lol-champ-select/v1/session', listenChampSelect);
        }

        if (data === 'GameStart') {
            win.webContents.send('break_pick_champion_flow');
        }

        if (data === 'InProgress') {
            win.webContents.send('break_pick_champion_flow');
        }

        if (data === 'None') {
            win.webContents.send('break_pick_champion_flow');
        }

        if (data === 'Lobby') {
            // powerCanUse_autoPickChampion = true;
            ws.unsubscribe('/lol-champ-select/v1/session');
            win.webContents.send('break_pick_champion_flow');
        }

        // 自动接受对局
        if (data === 'ReadyCheck') {
            const autoAccept = appSetting.get('autoAccept');
            if (autoAccept) lcuServer.acceptMatchmaking();
        }
    });

    const listenChampSelect = throttle(
        (data: any) => {
            if (!data) return;

            wssListenConsole('/lol-champ-select/v1/session');

            const autoPick: string = appSetting.get('autoPickChampion.championId');
            const autoBan: string = appSetting.get('autoBanChampion.championId');

            // 原先是二维数组，如果是 5V5 的对战需要比较 25次 拍平之后是 比较 10次（但是拍平也需要性能）
            const actions: any[] = data.actions.flat();

            // 从队列中单独取出召唤师的信息数据
            const actionElement = actions.find(el => el.actorCellId === data.localPlayerCellId);

            if (!actionElement) return;

            if (actionElement.isInProgress) {
                console.log('actionElement.type', actionElement.type);
                if (actionElement.type === 'pick') {
                    console.log('召唤师 选择 英雄环节');
                    // actionElement.championId === 0   表示召唤师还没有选择英雄
                    // actionElement.completed          表示召唤师还没有确定
                    if (actionElement.championId === 0 && !actionElement.completed && autoPick) {
                        lcuServer.autoPickChampion(autoPick, actionElement.id.toString());
                        // 处理完之后立即卸载监听
                        ws.unsubscribe('/lol-champ-select/v1/session');
                    } else if (actionElement.championId !== 0 && !actionElement.completed) {
                        console.log('选择', actionElement.championId);
                        win.webContents.send('pick_champion_flow', {
                            championId: actionElement.championId
                        });
                    }
                } else if (actionElement.type === 'ban') {
                    console.log('召唤师 禁用 英雄环节');
                    if (actionElement.championId === 0 && !actionElement.completed && autoBan) {
                        lcuServer.autoBanChampion(autoBan, actionElement.id.toString());
                    } else if (actionElement.championId !== 0 && !actionElement.completed) {
                        console.log('选择', actionElement.championId);

                        win.webContents.send('ban_champion_flow', {
                            championId: actionElement.championId
                        });
                    }
                }
            }
        },
        500,
        {
            leading: false
        }
    );

    // 补救，就是为了防止用户退出之后重新进来无法再次使用功能
    const res = await lcuServer.checkSession();

    if ((res as any)?.httpStatus === 404) {
        console.log('当前找不到正在会话');
    } else {
        res && listenChampSelect(res as any);
    }

    // ================================== 测试
    // https://lcu.vivide.re/
    // ws.subscribe('/lol-champ-select/v1/bannable-champions', function () {
    //     wssListenConsole(`/lol-champ-select/v1/bannable-champions`);
    //     console.log(1, arguments);
    // });

    // ws.subscribe('/lol-champ-select/v1/pickable-champions', function () {
    //     wssListenConsole(`/lol-champ-select/v1/pickable-champions`);
    //     console.log(2, arguments);
    // });

    // 我的环节
    // /lol-champ-select/v1/session/my-selection

    // /lol-champions/v1/inventories/{summonerId}/champions/{championId} GET

    // 获取当前选择的英雄
    // /lol-champ-select/v1/current-champion GET

    // 测试是否可用
    //  /lol-gameflow/v1/availability

    // 流阶段
    // /lol-gameflow/v1/gameflow-phase

    // 玩家状态
    // /lol-gameflow/v1/gameflow-metadata/player-status

    // /lol-gameflow/v1/session/event

    // Champion - 英雄角色
    // Summoner -玩家
    // Rune - 符文
    // Mastery -天赋
    // Game / Match - 游戏局、比赛，两词无本质区别
    // Item - 物品/装备
    // Team - 战队
    // League - 排位战区，如：希维尔的狩猎领域039
    // Spell - 召唤师技能
    // Event - 事件，如击杀、推塔、杀怪
    // Point - 事件发生坐标(Sight)
    // Wards - 视野道具
}
