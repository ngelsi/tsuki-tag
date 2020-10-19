import Picture from "./pictures/Picture";

export default class WorkspacePictures {

    constructor() {

        /**
         * @member
         * @public
         * @type {Array<Picture>}
         */
        this.pictures = [];

        /**
         * @member
         * @public
         * @type {Number}
         */
        this.version = 1;
    }

    /**
     * @returns {String}
     */
    static get name() {
        return 'workspacepictures';
    }

    /**
     * @returns {WorkspacePictures}
     */
    static get default() {
        return {
            version: 1,
            pictures: []
        };
    }
}