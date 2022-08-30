import ElectronStore from 'electron-store';

ElectronStore.initRenderer();

const appSetting = new ElectronStore({
    defaults: {
        autoPickChampion: {
            championId: '157',
            isAuto: false
        },
        autoBanChampion: {
            championId: '101',
            isAuto: false
        },
        gameDirectory: '',
        autoAccept: true
    }
});

export { appSetting };
