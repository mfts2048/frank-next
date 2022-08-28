import { http2Request } from '../utils/request';

export async function getMatchHistory(summonerId: string, begIndex: number, endIndex: number) {
    return await http2Request<any>(
        `/lol-match-history/v3/matchlist/account/${summonerId}?begIndex=${begIndex}&endIndex=${endIndex}`,
        'GET'
    );
}
