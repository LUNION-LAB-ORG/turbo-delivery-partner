'use client';

import Cookies from 'universal-cookie';

import en from './public/locales/en/index.json';
import ae from './public/locales/ae/index.json';
import da from './public/locales/da/index.json';
import de from './public/locales/de/index.json';
import el from './public/locales/el/index.json';
import es from './public/locales/es/index.json';
import fr from './public/locales/fr/index.json';
import hu from './public/locales/hu/index.json';
import it from './public/locales/it/index.json';
import ja from './public/locales/ja/index.json';
import pl from './public/locales/pl/index.json';
import pt from './public/locales/pt/index.json';
import ru from './public/locales/ru/index.json';
import sv from './public/locales/sv/index.json';
import tr from './public/locales/tr/index.json';
import zh from './public/locales/zh/index.json';

const langObj: Record<string, any> = {
    en, ae, da, de, el, es, fr, hu, it, ja, pl, pt, ru, sv, tr, zh,
};

const cookies = new Cookies(null, { path: '/' });

const getLang = (): string => {
    return cookies.get('i18nextLng') ?? 'en';
};

export const getTranslation = () => {
    const lang = getLang();
    const data = langObj[lang] ?? langObj.en;

    const t = (key: string): string => data[key] ?? key;

    const i18n = {
        language: lang,
        changeLanguage(newLang: string) {
            cookies.set('i18nextLng', newLang, { path: '/' });
        },
    };

    const initLocale = (fallbackLocale: string) => {
        const currentLang = getLang();
        if (!currentLang && fallbackLocale) {
            cookies.set('i18nextLng', fallbackLocale, { path: '/' });
        }
    };

    return { t, i18n, initLocale };
};
