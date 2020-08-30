const en = {

    "misc.close": "Close",

    "search.providers": "Providers",
    "search.empty": "No more results.",
    "search.tags": "Search tags",

    "safebooru": "Safebooru",
    "konachan": "Konachan",

    "picture.tags": "Tags",
};

const options = {
    selectedLanguage: "en"
};

const languages = {
    "en": en
};

const t = function (key, language) {
    return languages[language || options.selectedLanguage][key] || key;
};

export { t, options };