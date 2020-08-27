export default class Picture {

    constructor() {

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._id = null;

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._parentId = null;

        /**
         * @member
         * @protected
         * @type {Number}
         */
        this._score = 0;

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._rating = null;

        /**
         *  @member
         *  @protected
         *  @type {String}
         */
        this._md5 = null;

        /**
         *  @member
         *  @protected
         *  @type {String}
         */
        this._source = null;

        /**
         * @member
         * @protected
         * @type {Date}
         */
        this._createdAt = 0;

        /**
         * @member
         * @protected
         * @type {Number}
         */
        this._createdBy = 0;

        /**
         * @member
         * @protected
         * @type {Number}
         */
        this._width = 0;

        /**
         * @member
         * @protected
         * @type {Number}
         */
        this._height = 0;

        /**
         * @member
         * @protected
         * @type {Number}
         */
        this._previewWidth = 0;

        /**
         * @member
         * @protected
         * @type {Number}
         */
        this._previewHeight = 0;

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._previewUrl = null;

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._url = null;

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._status = null;

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._tags = null;

        /**
         * @member
         * @protected
         * @type {Boolean}
         */
        this._hasChildren = false;
    }

    /**
     * @property
     * @public
     * @type {Array<String>}
     */
    get tags() {
        return this._tags.trim().split(' ');
    }

    get url() {
        return this._url;
    }

    get previewUrl() {
        return this._previewUrl;
    }

    get md5() {
        return this._md5;
    }

    get tagString() {
        return this._tags;
    }

    /**
     * Sets the fields of the picture from the provided object.
     * @method
     * @abstract
     * @param {Object} obj the object containing properties to be assigned to this instance.
     * @returns {void}
     */
    fromData(obj) {}
}