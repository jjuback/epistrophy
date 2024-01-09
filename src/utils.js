export function makeUrl(fragment) {
    return !fragment ? "no-cover.jpg" : "https://epistrophy.blob.core.windows.net/cd-vault/" + fragment;
}
