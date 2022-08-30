import { execCmd } from '../utils/execCmd';
import { appSetting } from '../constant/setting';

export const startClientExe = (exe: string) => execCmd(`start "" "${exe}"`, false);

export const startClient = async () => {
    const gameDirectory = appSetting.get('gameDirectory');

    if (gameDirectory) {
        await startClientExe(gameDirectory);
        return true;
    }
    return false;
};
