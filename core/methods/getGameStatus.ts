import { http2Request } from '../utils/request';
import { translate } from '../utils/translate';

export async function getGameStatus() {
    const gameStatus = await http2Request<string>('/lol-gameflow/v1/gameflow-phase', 'GET');
    return translate('status', gameStatus);
}
