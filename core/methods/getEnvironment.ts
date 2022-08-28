import { http2Request } from '../utils/request';
import { translate } from '../utils/translate';

export async function getEnvironment() {
    const result = await http2Request<any>('/riotclient/v1/crash-reporting/environment', 'GET');
    return translate('environment', result.environment);
}
