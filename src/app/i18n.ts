import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const initI18n = () => {
  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: {
          Word: 'Word',
          Pos: 'Pos',
          Translated: 'Translated',
        },
      },
      ja: {
        translation: {
          Word: '英単語',
          Pos: '品詞',
          Translated: '翻訳',
        },
      },
    },
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: { escapeValue: false },
  });
};
