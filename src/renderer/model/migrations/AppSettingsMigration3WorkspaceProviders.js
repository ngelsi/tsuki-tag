import AppSettings from "../AppSettings";
import DataStoreMigration from "./DataStoreMigration";

export default class AppSettingsMigration3WorkspaceProviders extends DataStoreMigration {

    constructor() {
        super(AppSettings.name, 3);
    }

    /**
     * Applies the changes to the data structure.
     * @method
     * @override
     * @param {AppSettings} data the data from the previous version.
     * @returns {void}
     */
    apply(data) {
        data.workspaceProviders = [];
    }
}