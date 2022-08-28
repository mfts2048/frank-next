import { Credentials } from '../league-connect';
import { getProfileIcon } from '../utils';
import { http1Request } from '../utils/request';

export interface CurrentSummonerResponse {
    accountId: number;
    displayName: string;
    internalName: string;
    nameChangeFlag: boolean;
    percentCompleteForNextLevel: number;
    privacy: string;
    profileIconId: number;
    puuid: string;
    rerollPoints: {
        currentPoints: number;
        maxRolls: number;
        numberOfRolls: number;
        pointsCostToRoll: number;
        pointsToReroll: number;
    };
    summonerId: number;
    summonerLevel: number;
    unnamed: boolean;
    xpSinceLastLevel: number;
    xpUntilNextLevel: number;
}

export interface CurrentSummoner {
    displayName: string; // 玩家昵称
    summonerLevel: number; // 玩家等级
    avatar: string; // 玩家图标id
    puuid: string; // puuid 用来获取玩家排位信息
    summonerId: number;
}

export async function getCurrentSummoner() {
    const response = await http1Request<CurrentSummonerResponse>(
        `/lol-summoner/v1/current-summoner`,
        'GET'
    );

    return {
        displayName: response.displayName, // 玩家昵称
        summonerLevel: response.summonerLevel, // 玩家等级
        avatar: getProfileIcon(response.profileIconId.toString()), // 玩家图标id
        puuid: response.puuid, // puuid 用来获取玩家排位信息
        summonerId: response.summonerId
    };
}
