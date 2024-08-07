export function makeUrl(fragment, genre) {
    let vault = genre === 0 ? "cd-vault/" : "cd-vault-classical/";
    let cover = genre === 0 ? "no-cover.jpg" : "no-cover-classical.jpg";
    return !fragment ? cover : "https://epistrophy.blob.core.windows.net/" + vault + fragment;
}
