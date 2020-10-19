import Workspace from './Workspace';

export default class AppSettings {
    constructor() {

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.endlessScrolling = false;

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.processNonexistingMetadata = false;

        /**
         * @member
         * @public
         * @type {Array<String>}
         */
        this.onlineProviders = [];

        /**
         * @member
         * @public
         * @type {Array<String>}
         */
        this.workspaceProviders = [];

        /**
         * @member
         * @public
         * @type {Array<Workspace>}
         */
        this.workspaces = [];

        /**
         * @member
         * @public
         * @type {Array<String>}
         */
        this.ratings = [];

        /**
         * @member
         * @public
         * @type {Number}
         */
        this.version = 4;
    }

    /**
     * @returns {String}
     */
    static get name() {
        return 'appsettings';
    }

    /**
     * @returns {AppSettings}
     */
    static get default() {
        return {
            version: 4,
            endlessScrolling: false,
            processNonexistingMetadata: false,
            onlineProviders: [
                'safebooru',
                'konachan',
                'danbooru',
                'gelbooru'
            ],
            workspaceProviders: [

            ],
            workspaces: [

            ],
            ratings: [
                's'
            ]
        };
    }
}