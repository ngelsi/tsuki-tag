export default class Workspace {
    constructor() {

        /**
         * @member
         * @public
         * @type {String}
         */
        this.name = null;

        /**
         * @member
         * @public
         * @type {String}
         */
        this.path = null;

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.default = false;

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.subdirectories = true;

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.downloadSourcePictures = true;

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.convertToJpg = true;

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.includeTags = true;

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.includeMetadata = true;

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.namingConvention = "{md5}_{provider}.{extension}";
    }
}