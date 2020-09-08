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
    "search.providerempty": "No more results from provider '{provider}'.",
    "search.processerror": "Could not process pictures from provider '{provider}'.",
    "search.httperror": "Communication failed with provider '{provider}'.",
    "search.tags": "Search tags",
    "search.error": "Unknown errors happened during picture retrieval.",

    "nav.onlineproviders": "Browse online",
    "nav.settings": "Settings",

    "settings.workspaces": "Workspaces",
    "settings.noworkspaces": "No workspaces have been configured yet.",
    "settings.workspacename": "Name",
    "settings.workspacepath": "Folder path",
    "settings.workspacesourcepictures": "Download source pictures (slower, bigger file size)",
    "settings.workspaceconverttojpg": "Convert non-JPG images to JPG (only JPG images have metadata support)",
    "settings.workspaceincludetags": "Inject tags into metadata on save",
    "settings.workspaceincludemetadata": "Inject picture related metadata on save",
    "settings.workspacenamingconvention": "Picture file name template",
    "settings.workspacenamingconventionhelp": "Possible template parts are: {id}, {md5}, {provider}, {tagString}, {rating}, {score}, {width}, {height}, {dimensions}, {extension}",
    "settings.defaultworkspace": "Default workspace",
    "settings.includesubdirectories": "Include subdirectories",
    "settings.pathexists": "Selected path is already part of a workspace.",
    "settings.nameunique": "Workspace name must be unique.",
    "settings.valuerequired": "This is required.",
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

    "op.savedefault": "Save to default workspace",
    "op.saveselect": "Save to workspace...",
    "op.nodefaultworkspace": "No default workspace has been configured yet.",
    "op.picturesaved": "Saved to workspace '{0}' as '{1}'",
    "op.picturesaveerror": "Could not save picture. Check writing rights and access to workspace '{0}'.",

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