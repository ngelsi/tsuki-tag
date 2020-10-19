import AppSettings from "../AppSettings";
import DataStoreMigration from "./DataStoreMigration";

export default class AppSettingsMigration4WorkspaceProviders extends DataStoreMigration {

    constructor() {
        super(AppSettings.name, 4);
    }

    /**
     * Applies the changes to the data structure.
     * @method
     * @override
     * @param {AppSettings} data the data from the previous version.
     * @returns {void}
     */
    apply(data) {
        data.processNonexistingMetadata = false;
    }
}