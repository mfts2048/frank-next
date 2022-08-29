import { createHttp1Request, createHttp2Request, createHttpSession } from './league-connect';
import type { Credentials } from './league-connect';
import { getChampionMastery } from './methods/getChampionMastery';
import { getCurrentSummoner } from './methods/getCurrentSummoner';
import { HttpRequest } from './utils/request';
import { getGameStatus } from './methods/getGameStatus';
import credentialsCore from './utils/credentials';
import { getEnvironment } from './methods/getEnvironment';
import { getMatchHistory } from './methods/getMatchHistory';
import { setRunePage } from './methods/setRunePage';
import { getProfileSummary } from './methods/getProfileSummary';
// import { translate } from "./translate";
// import { ChampionMasteryResponse, CurrentSummoner, LolChampSelectV1Session, LolChampSelectV1SessionError, RankedStatusInfo } from "./types";
// import { getProfileIcon } from "./constant";
// import { champDict } from "./static/lolDataList";

export async function setupLcuServer() {
    try {
        const credentials = await credentialsCore.init();
        return new LcuServerCore(credentials);
    } catch (e) {
        console.log('league client process could not be located');
        return undefined;
    }
}

export class LcuServerCore {
    public credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    /**
     *
     * @returns 获取当前登入账号信息
     */
    async getCurrentSummoner() {
        return await getCurrentSummoner();
    }

    /**
     *
     * @returns 获取玩家游戏状态
     */
    async getGameStatus() {
        return await getGameStatus();
    }

    /**
     *
     * @returns 获取当前客户端所在大区
     */
    async getEnvironment() {
        return await getEnvironment();
    }

    /**
     *
     * @returns 获取当前用户排位信息
     */
    // async getRankedStatusInfoByPuuid(puuid: string) {
    //     const result = await this.http2Request<RankedStatusInfo>(`/lol-ranked/v1/ranked-stats/${puuid}`);
    //     return [
    //         {
    //             rankedName: "单双排",
    //             rankedHighestTier: result.highestPreviousSeasonEndTier,
    //             rankedHighest: `${translate("rank", result.highestPreviousSeasonEndTier)} ${result.highestPreviousSeasonEndDivision}`
    //         },
    //         {
    //             rankedName: "灵活组排",
    //             rankedHighestTier: result.queueMap.RANKED_SOLO_5x5.tier,
    //             rankedHighest: `${translate("rank", result.queueMap.RANKED_SOLO_5x5.tier)} ${result.queueMap.RANKED_SOLO_5x5.division} ${result.queueMap.RANKED_SOLO_5x5.leaguePoints}`
    //         },
    //         {
    //             rankedName: "历史最高",
    //             rankedHighestTier: result.queueMap.RANKED_FLEX_SR.tier,
    //             rankedHighest: `${translate("rank", result.queueMap.RANKED_FLEX_SR.tier)} ${result.queueMap.RANKED_FLEX_SR.division} ${result.queueMap.RANKED_FLEX_SR.leaguePoints}`
    //         }
    //     ];
    // }

    /**
     *
     * @returns 获取当前玩家的历史20局比赛记录
     */
    async getHistoryMatchesByPuuid(puuid: string, begin = 0, end = 20) {
        const result = await this.http2Request<any>(
            `/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=${begin}&endIndex=${end}`
        );
        return result.games.games;
    }

    /**
     *
     * @returns 发送客户端提醒
     */
    async sendNotifications(title: string, details: string) {
        const req = {
            backgroundUrl: '',
            created: '',
            critical: true,
            data: {
                details: details,
                title: title
            },
            detailKey: 'pre_translated_details',
            dismissible: true,
            expires: '',
            iconUrl: '',
            id: 0,
            source: '',
            state: 'toast',
            titleKey: 'pre_translated_title',
            type: 'ranked_summary'
        };
        return await this.http1Request('/player-notifications/v1/notifications', 'POST', req);
    }

    /**
     *
     * @returns 接收对局
     */
    async acceptMatchmaking(): Promise<void> {
        // http1Request 可以；http1Request 不行且异常
        await this.http1Request('/lol-matchmaking/v1/ready-check/accept', 'POST');
    }

    /**
     *
     * @param championId 英雄id
     * @param cellId
     * @param type 'pick' | 'ban'
     * @returns 在选择英雄界面，选择并确定英雄
     */
    async selectChampionById(championId: string, cellId: string, type: 'pick' | 'ban') {
        const req = {
            championId: championId,
            completed: true,
            type: type
        };
        return await this.http1Request(
            `/lol-champ-select/v1/session/actions/${cellId}`,
            'PATCH',
            req
        );
    }

    /**
     *
     * @param championId 英雄id
     * @returns 自动秒选英雄
     */
    async autoPickChampion(championId: string, cellId: string) {
        return await this.selectChampionById(championId, cellId, 'pick');
    }

    /**
     *
     * @param championId 英雄id
     * @returns 自动禁用英雄
     */
    async autoBanChampion(championId: string, cellId: string) {
        return await this.selectChampionById(championId, cellId, 'ban');
    }

    /**
     *
     * @returns 获取选人会话
     */
    //  LolChampSelectV1SessionError | LolChampSelectV1Session
    async checkSession() {
        return await this.http1Request<any>('/lol-champ-select/v1/session', 'GET');
    }

    /**
     *
     * @param championId 英雄id
     * @returns 获取某英雄的信息（皮肤，台词等）
     */
    async getChampionSkinListById(championId: string) {
        return await this.http2Request(`/lol-game-data/assets/v1/champions/${championId}.json`);
    }

    /**
     *
     * @returns 获取当前选择的英雄
     */
    async getCurrentChampion() {
        const currentChamp = await this.http2Request<
            | number
            | {
                  errorCode: string; // 'RPC_ERROR',
                  httpStatus: number; // 404,
                  implementationDetails: any; // {},
                  message: string; // 'No active delegate'
              }
        >('/lol-champ-select/v1/current-champion');
        return currentChamp;
    }

    /**
     *
     * @returns 获取玩家对英雄的熟悉度
     */
    async getChampionMastery(summonerId: string) {
        return await getChampionMastery(summonerId);
    }

    /**
     *
     * @returns 根据召唤师ID查询战绩
     */
    async getMatchHistory<T>(summonerId: string, begIndex: number, endIndex: number) {
        return await getMatchHistory(summonerId, begIndex, endIndex);
    }

    /**
     *
     * @returns 根据游戏id获取详细的游戏对局
     */
    async getGameDetailsByGameId<T>(gameId: string) {
        return await this.http1Request<T>(`/lol-match-history/v1/games/${gameId}`, 'GET');
    }

    /**
     *
     * @returns 设置符文页
     */
    async setRunePage(data: any) {
        return await setRunePage(data);
    }

    /**
     *
     * @returns 获取永恒星碑
     */
    async getProfileSummary(puuid: string) {
        return await getProfileSummary(puuid);
    }

    // lcu http1 request
    async http1Request<T = any>(
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
        body?: Record<string, unknown> | undefined | null
    ) {
        const response = await createHttp1Request(
            {
                method: method,
                url: url,
                body: body
            },
            this.credentials
        );

        return response.json<T>();
    }

    // lcu http2 request
    async http2Request<T = any>(
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
        body?: Record<string, unknown>
    ) {
        const session = await createHttpSession(this.credentials);
        const response = await createHttp2Request(
            {
                method,
                url,
                body
            },
            session,
            this.credentials
        );
        // Remember to close the session when done
        session.close();
        return response.json<T>();
    }
}

export abstract class LcuServerCoreBase {
    abstract http1Request: HttpRequest;
    abstract http2Request: HttpRequest;
}
