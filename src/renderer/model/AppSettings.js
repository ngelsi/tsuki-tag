import Workspace from './Workspace';

export default class AppSettings {
    constructor() {
        /**
         * @member
         * @public
         * @type {Array<String>}
         */
        this.onlineProviders = [];

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
            version: 1,
            onlineProviders: [
                'safebooru',
                'konachan',
                'danbooru',
                'gelbooru'
            ],
            workspaces: [

            ],
            ratings: [
                's',
                'q',
                'e'
            ]
        };
    }
}