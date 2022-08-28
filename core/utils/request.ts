import { createHttp1Request, createHttp2Request, createHttpSession } from '../league-connect';
import credentialsCore from '../utils/credentials';

export type HttpRequest = <T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body?: Record<string, unknown>
) => Promise<T>;

// lcu http1 request
export const http1Request: HttpRequest = async (url, method, body) => {
    const credentials = credentialsCore.getCredentials();
    if (credentials) {
        const response = await createHttp1Request(
            {
                method: method,
                url: url,
                body: body
            },
            credentials
        );

        return response.json();
    }
    return Promise.reject('没有检测到客户端');
};

// lcu http2 request
export const http2Request: HttpRequest = async (url, method, body) => {
    const credentials = credentialsCore.getCredentials();
    if (credentials) {
        const session = await createHttpSession(credentials);
        const response = await createHttp2Request(
            {
                method,
                url,
                body
            },
            session,
            credentials
        );
        // Remember to close the session when done
        session.close();
        return response.json();
    }
    return Promise.reject('没有检测到客户端');
};
