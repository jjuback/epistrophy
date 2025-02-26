export const config = {
    EPISTROPHY_API_URL: 'https://epistrophy-api.azurewebsites.net',
    //EPISTROPHY_API_URL: 'http://localhost:5132',
    ICON_SEARCH: '\u{1f50d}\ufe0e',
    ICON_CANCEL: '\u2715'
}

export function makeUrl(fragment, genre) {
    let vault = genre === 0 ? "cd-vault/" : "cd-vault-classical/";
    let cover = genre === 0 ? "no-cover.jpg" : "no-cover-classical.jpg";
    return !fragment ? cover : "https://epistrophy.blob.core.windows.net/" + vault + fragment;
}
