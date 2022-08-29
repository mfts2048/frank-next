export const getImaUrl = (imgId: string) =>
    new URL(`../assets/runes/${imgId}.png`, import.meta.url).href;

export const getImaUrl2 = (imgUrl: string) => {
    return new URL(`../assets/statstones/${imgUrl.toLowerCase()}`, import.meta.url).href;
};
