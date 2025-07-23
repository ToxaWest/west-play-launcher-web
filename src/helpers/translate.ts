import {getFromStorage} from "./getFromStorage";

class Translate {
    language = getFromStorage('config')?.settings?.currentLang || 'english';
    dictionary = {}

    init = async (): Promise<void> => {
        if (this.language === 'english') return
        try {
            this.dictionary = (await import(`../i18n/${this.language}.json`)).default // Dynamic path
        } catch (e) {
            console.error(e)
        }
    }

    replace = (string: string, values = {}): string => {
        let res = string;
        Object.entries(values).forEach(([key, value]) => {
            const regex = new RegExp(`\\{\\{${key}}}`, 'gm');
            res = res.replaceAll(regex,  value.toString());
        })

        return res
    }

    t = (string: string, values?: {}): string => {
        if(this.dictionary[string]){
            return this.replace(this.dictionary[string], values);
        }
        console.log('Translate: ', string)
        return this.replace(string, values);
    }
}

const i18n = new Translate();
export default i18n;