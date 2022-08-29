import { champDict } from '../constant/lolDataList';
import { http1Request } from '../utils/request';

export interface ChampionMasteryResponse {
    championId: number;
    championLevel: number;
    championPoints: number;
    championPointsSinceLastLevel: number;
    championPointsUntilNextLevel: number;
    chestGranted: boolean;
    formattedChampionPoints: string;
    formattedMasteryGoal: string;
    highestGrade: string;
    lastPlayTime: number;
    playerId: number;
    tokensEarned: number;
    champImgUrl?: string;
}

export async function getChampionMastery(summonerId: string | number) {
    const response = await http1Request<ChampionMasteryResponse[]>(
        `/lol-collections/v1/inventories/${summonerId}/champion-mastery`,
        'GET'
    );

    const alias = (item: ChampionMasteryResponse) => champDict[String(item.championId)].alias;

    if (!Array.isArray(response)) {
        return [];
    }

    response.forEach(item => {
        item.champImgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${alias(item)}.png`;
    });

    return response;
}
