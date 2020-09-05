export default class DataStoreMigration {

    /**
     * @constructor
     * @param {String} name 
     * @param {Number} version 
     */
    constructor(name, version) {

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._name = name;

        /**
         * @member
         * @protected
         * @type {Number}
         */
        this._version = version;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get name() {
        return this._name;
    }

    /**
     * @property
     * @public
     * @type {Number}
     */
    get version() {
        return this._version;
    }

    /**
     * Applies the changes to the data structure.
     * @method
     * @abstract
     * @param {Object} data the data from the previous version.
     * @returns {void}
     */
    apply(data) { }
}