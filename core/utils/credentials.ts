import { authenticate, Credentials } from '../league-connect';

class CredentialsCore {
    private credentials: Credentials | undefined;
    constructor() {}

    async init() {
        this.credentials = await setupCredentials();
        return this.credentials;
    }

    async reset() {
        this.credentials = await setupCredentials();
        return this.credentials;
    }

    getCredentials() {
        return this.credentials;
    }
}

// 检测游戏客户端是否正在运行
// 主要使用获取玩家登录信息来判断用户是否开启客户端
// 获取游戏基本信息，如端口号和https秘钥
export async function setupCredentials() {
    try {
        const credentials = await authenticate();
        return credentials;
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

export default new CredentialsCore();
