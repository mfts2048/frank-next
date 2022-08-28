import { http1Request } from '../utils/request';

export async function setRunePage(data: any) {
    try {
        // 获取符文页信息
        const currentRuneList = await http1Request<any>('lol-perks/v1/pages', 'GET');

        const current = currentRuneList.find(i => i.current && i.isDeletable);
        if (current != undefined) {
            // 删除当前符文页
            await http1Request(`lol-perks/v1/pages/${current.id}`, 'DELETE');
        }
        // 写入新的符文页
        await http1Request('lol-perks/v1/pages', 'POST', data);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
