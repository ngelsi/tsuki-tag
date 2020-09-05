export default class AppSettings {
    constructor() {
        this.onlineProviders = [];
        this.workspaces = [];
    }

    static get name() {
        return 'appsettings';
    }

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

            ]
        };
    }
}