import { champDict } from '../../core/constant/lolDataList';

export interface GameRecordsResponse {
    games: {
        gameBeginDate: string;
        gameCount: number;
        gameEndDate: string;
        gameIndexBegin: number;
        gameIndexEnd: number;
        games: any[];
    };
}

export const dealWithGameRecordsResponse = (response: GameRecordsResponse): GameRecordsResponse => {
    response.games.games = dealMatchHistory(response.games.games);

    return response;
};

export const dealMatchHistory = (matchList: any[], mode?: string): any[] => {
    const simpleMatchList = [];
    const specialSimpleMatchList = [];
    for (const matchListElement of matchList.reverse()) {
        // 本局游戏ID
        const gameId = matchListElement.gameId;
        // 召唤师选择的英雄
        const champImgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${
            champDict[String(matchListElement.participants[0].championId)].alias
        }.png`;
        const champ = champDict[String(matchListElement.participants[0].championId)].title;
        // 是否取得胜利
        const isWin = matchListElement.participants[0].stats.win == true ? true : false;
        // 击杀数目
        const kills = matchListElement.participants[0].stats.kills;
        // 死亡数目
        const deaths = matchListElement.participants[0].stats.deaths;
        // 助攻数目
        const assists = matchListElement.participants[0].stats.assists;
        // 游戏时间
        const matchTime = timestampToDate(matchListElement.gameCreation);
        // 游戏模式
        const queueId = queryGameType(matchListElement.queueId);
        if (queueId === mode) {
            specialSimpleMatchList.push({
                gameId,
                champImgUrl,
                isWin,
                kills,
                deaths,
                assists,
                matchTime,
                queueId,
                champ
            });
        }
        if (mode === undefined) {
            simpleMatchList.push({
                gameId,
                champImgUrl,
                isWin,
                kills,
                deaths,
                assists,
                matchTime,
                queueId,
                champ
            });
        }
    }
    if (mode === undefined) {
        return simpleMatchList;
    } else {
        return specialSimpleMatchList;
    }
};

const timestampToDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return (
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        date.getDate()
    );
};

// 根据游戏模式ID判断 游戏模式
const queryGameType = (queueId: number) => {
    switch (queueId) {
        case 420:
            return '单排/双排';
        case 430:
            return '匹配模式';
        case 440:
            return '灵活排位';
        case 450:
            return '极地大乱斗';
    }
    return '其它模式';
};
