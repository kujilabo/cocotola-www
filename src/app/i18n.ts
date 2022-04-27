import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const initI18n = () => {
  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: {
          Edit: 'Edit',
          Pos: 'Pos',
          SignOut: 'Sign out',
          Translated: 'Translated',
          Update: 'Update',
          Word: 'Word',
        },
      },
      ja: {
        translation: {
          Edit: '編集する',
          Pos: '品詞',
          SignOut: 'サインアウト',
          Translated: '翻訳',
          Update: '更新する',
          Word: '英単語',
        },
      },
    },
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: { escapeValue: false },
  });
};
