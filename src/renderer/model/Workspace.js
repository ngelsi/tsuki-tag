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
    }
}