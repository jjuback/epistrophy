export function makeUrl(fragment, genre) {
    let vault = genre === 0 ? "cd-vault/" : "cd-vault-classical/";
    return !fragment ? "no-cover.jpg" : "https://epistrophy.blob.core.windows.net/" + vault + fragment;
}
