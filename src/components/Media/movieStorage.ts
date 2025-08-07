import type {MovieStorageFavorites, MovieStorageHistory} from "@type/movieStorage.types";

import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";

class MovieStorage {
    history: MovieStorageHistory[] = [];
    favorites: MovieStorageFavorites[] = [];
    time: { [key: string]: number } = {}

    constructor() {
        const h = getFromStorage('history');
        if (h) this.history = h;
        else setToStorage('history', this.history);

        const f = getFromStorage('movieFavorites');
        if (f) this.favorites = f;
        else setToStorage('movieFavorites', this.favorites);

        const t = getFromStorage('movieTime');
        if (t) this.time = t;
        else setToStorage('movieTime', this.time)
    }

    setTime(key: string, value: number) {
        if (value > this.getTime(key) + 5) {
            this.time[key] = value;
            setToStorage('movieTime', this.time);
        }
    }

    getTime(key: string): number | 0 {
        return this.time[key] || 0;
    }

    addToFavorites({url, image, title, subtitle}: { url: string, image: string, title: string, subtitle: string }) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.favorites.findIndex(({href: u}) => u === pathname);
        if (index !== -1) {
            this.favorites[index].title = title;
            this.favorites[index].subtitle = subtitle;
            this.favorites[index].image = image;
        } else {
            this.favorites.push({href: pathname, image, subtitle, title})
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

    addToHistory({url, image, title, subtitle}: { url: string, image?: string, title?: string, subtitle?: string }) {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const index = this.history.findIndex(({href: u}) => u === pathname);
        if (index !== -1) {
            if (title) this.history[index].title = title;
            if (image) this.history[index].image = image;
            if (subtitle) this.history[index].subtitle = subtitle
        } else {
            this.history.push({href: pathname, image, subtitle, title})
        }
        setToStorage('history', this.history);
    }
}

export default new MovieStorage()