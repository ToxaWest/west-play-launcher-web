import type {MovieStorageFavorites, MovieStorageHistory} from "@type/movieStorage.types";

import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";

class MovieStorage {
    history: MovieStorageHistory[] = [];
    favorites: MovieStorageFavorites[] = [];

    constructor() {
        const h = getFromStorage('history');
        if (h) this.history = h;
        else setToStorage('history', this.history);

        const f = getFromStorage('movieFavorites');
        if (f) this.favorites = f;
        else setToStorage('movieFavorites', this.favorites);
    }

    addToFavorites({url, image, title} : {url: string, image: string, title: string}) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.favorites.findIndex(({href: u}) => u === pathname);
        if (index !== -1) {
            this.favorites[index].title = title;
            this.favorites[index].image = image;
        } else {
            this.favorites.push({href: pathname, image, title})
        }
        setToStorage('movieFavorites', this.favorites);
    }

    isFavorites(url: string) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        return this.favorites.findIndex(({href: u}) => u === pathname) !== -1;
    }

    removeFromFavorites(url: string) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.favorites.findIndex(({href: u}) => u === pathname);
        if (index !== -1) {
            this.favorites.splice(index, 1);
            setToStorage('movieFavorites', this.favorites);
        }
    }

    addToHistory({url, image, title} : {url: string, image?: string, title?: string}) {
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

    getHistory(url: string): MovieStorageHistory | {} {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.history.findIndex(({href: u}) => u === pathname);
        return this.history[index] || {};
    }

    removeHistory(url: string) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.history.findIndex(({href: u}) => u === pathname);
        if (index !== -1) {
            this.history.splice(index, 1);
            setToStorage('history', this.history);
        }
    }

    update({season_id, episode_id, translation_id, url, currentTime}:{
        season_id?: number, episode_id?: number, translation_id?: string, url: string, currentTime?: number
    }) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.history.findIndex(({href: u}) => u === pathname);
        if (index !== -1) {
            if (season_id) this.history[index].season_id = season_id;
            if (episode_id) this.history[index].episode_id = episode_id;
            if (translation_id) this.history[index].translation_id = translation_id;
            if (typeof currentTime === "number") this.history[index].currentTime = currentTime;
            setToStorage('history', this.history);
        }
    }
}

export default new MovieStorage()