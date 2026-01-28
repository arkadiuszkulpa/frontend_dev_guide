import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'pl', flag: '🇵🇱' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`flex items-center justify-center w-10 h-10 rounded-lg text-xl transition-all ${
            i18n.language === lang.code || i18n.language?.startsWith(lang.code)
              ? 'bg-primary-100 ring-2 ring-primary-300'
              : 'hover:bg-gray-100'
          }`}
          aria-label={`Switch to ${lang.code === 'en' ? 'English' : 'Polish'}`}
        >
          <span role="img" aria-hidden="true">
            {lang.flag}
          </span>
        </button>
      ))}
    </div>
  );
}
