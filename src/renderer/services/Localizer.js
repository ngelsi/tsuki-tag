const en = {

    "misc.add": "Add",
    "misc.remove": "Remove",
    "misc.save": "Save",
    "misc.cancel": "Cancel",
    "misc.close": "Close",
    "misc.copy": "Copy",
    "misc.copied": "Copied to clipboard.",

    "search.providers": "Providers",
    "search.empty": "No more results.",
    "search.tags": "Search tags",

    "nav.onlineproviders": "Browse online",
    "nav.settings": "Settings",

    "settings.workspaces": "Workspaces",
    "settings.noworkspaces": "No workspaces have been configured yet.",
    "settings.workspacename": "Name",
    "settings.workspacepath": "Folder path",
    "settings.defaultworkspace": "Default workspace",
    "settings.includesubdirectories": "Include subdirectories",
    "settings.pathexists": "Selected path is already part of a workspace.",
    "settings.nameunique": "Workspace name must be unique.",
    "settings.namerequired": "Workspace name is required.",
    "settings.saved": "Settings saved.",
    "settings.saveerror": "Could not save settings. Check the data and try again.",
    "settings.validationerror": "Some settings are incorrect. Check displayed errors.",

    "safebooru": "Safebooru",
    "konachan": "Konachan",
    "danbooru": "Danbooru",
    "gelbooru": "Gelbooru",

    "danbooru.taglimit": "Danbooru has a limit of 2 tags per search.",

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