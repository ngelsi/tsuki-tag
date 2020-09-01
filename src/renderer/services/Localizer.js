const en = {

    "misc.close": "Close",

    "search.providers": "Providers",
    "search.empty": "No more results.",
    "search.tags": "Search tags",

    "safebooru": "Safebooru",
    "konachan": "Konachan",
    "danbooru": "Danbooru",

    "picture.tags": "Tags",
    "picture.metadatas": "Metadata",
    "picture.id": "ID",
    "picture.md5": "MD5",
    "picture.dimensions": "Size",
    "picture.height": "Height",
    "picture.width": "Width",
    "picture.provider": "Provider",
    "picture.source": "Source",
    "picture.score": "Score",
    "picture.createdAt": "Created at",

    "picture.rating": "Rating",
    "s": "Safe",
    "q": "Questionable",
    "e": "Explicit",

    "picture.extension": "Extension",
    "jpg": "JPG",
    "jpeg": "JPEG",
    "png": "PNG",
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