import { champDict } from '../constant/lolDataList';
import { http1Request } from '../utils/request';

export async function getProfileSummary(puuid: string) {
    const profileSummary = await http1Request<any[]>(
        `/lol-statstones/v1/profile-summary/${puuid}`,
        'GET'
    );

    let statstonesList = [];
    for (const statstonesElement of profileSummary) {
        const imgUrl = statstonesElement.imageUrl.split('LCU/')[1];
        statstonesList.push({
            championId: `${champDict[String(statstonesElement.championId)].label}`,
            name: statstonesElement.name,
            imgUrl,
            value: statstonesElement.value
        });
    }

    return statstonesList;
}
