import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";

class MovieStorage {
    history = [];

    constructor() {
        const h = getFromStorage('history');
        if (h) this.history = h;
        else setToStorage('history', this.history);
    }

    addToHistory({url, image, title}) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.history.findIndex(({href: u}) => u === pathname);
        if (index !== -1) {
            if (title) this.history[index].title = title;
            if (image) this.history[index].image = image;
        } else {
            this.history.push({href: pathname, image, title})
        }
        setToStorage('history', this.history);
    }

    getHistoryList() {
        return this.history;
    }

    getHistory(url) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.history.findIndex(({href: u}) => u === pathname);
        return this.history[index] || {};
    }

    removeHistory(url) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.history.findIndex(({href: u}) => u === pathname);
        if (index !== -1) {
            this.history.splice(index, 1);
            setToStorage('history', this.history);
        }
    }

    update({season_id, episode_id, translation_id, url}) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.history.findIndex(({href: u}) => u === pathname);
        if (index !== -1) {
            if (season_id) this.history[index].season_id = season_id;
            if (episode_id) this.history[index].episode_id = episode_id;
            if (translation_id) this.history[index].translation_id = translation_id;
            setToStorage('history', this.history);
        }
    }
}

export default new MovieStorage()