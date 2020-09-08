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
        this._provider = null;

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
        this._downloadUrl = null;

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
         * @type {String}
         */
        this._userTags = "";

        /**
         * @member
         * @protected
         * @type {Boolean}
         */
        this._hasChildren = false;

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._extension = null;
    }

    /**
     * @property
     * @public
     * @type {Array<String>}
     */
    get tags() {
        return this._tags.trim().split(' ');
    }

    /**
     * @property
     * @public
     * @type {Array<String>}
     */
    get userTags() {
        return [
            `rating_${this._rating}`,
            `provider_${this._provider}`
        ].concat(
            this._userTags.trim().split(' ')
        );
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get url() {
        return this._url;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get downloadUrl() {
        return this._downloadUrl;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get previewUrl() {
        return this._previewUrl;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get md5() {
        return this._md5;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get tagString() {
        return this._tags.trim().split(' ').concat(this._userTags.trim().split(' ')).join(' ');
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get provider() {
        return this._provider;
    }

    /**
     * @property
     * @public
     * @type {Number}
     */
    get width() {
        return this._width;
    }

    /**
     * @property
     * @public
     * @type {Number}
     */
    get height() {
        return this._height;
    }

    /**
     * @property
     * @public
     * @type {Number}
     */
    get previewWidth() {
        return this._previewWidth;
    }

    /**
     * @property
     * @public
     * @type {Number}
     */
    get previewHeight() {
        return this._previewHeight;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get dimensions() {
        return `${this._width}x${this._height}`;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get previewDimensions() {
        return `${this._previewWidth}x${this._previewHeight}`;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get id() {
        return this._id;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get createdAt() {
        return new Date(this._createdAt).toLocaleString();
    }

    /**
     * @property
     * @public
     * @type {Number}
     */
    get score() {
        return this._score;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get rating() {
        return this._rating;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get source() {
        return this._source;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get extension() {

        if (!this._extension) {
            const index = this._downloadUrl.lastIndexOf('.');
            this._extension = this._downloadUrl.substr(index + 1, this._downloadUrl.length - index);
        }

        return this._extension;
    }

    /**
     * @property
     * @public
     * @type {Array<string>}
     */
    get metadata() {
        return [
            `PROVIDER: ${this.provider}`,
            `ID: ${this.id}`,
            `MD5: ${this.md5}`,
            `URL: ${this.url}`,
            `SOURCE: ${this.source}`,
            `DOWNLOADURL: ${this.downloadUrl}`,
            `RATING: ${this.rating}`,
            `SCORE: ${this.score}`
        ];
    }

    /**     
     * @param {('user'|'tag')} target 
     * @param {String} tag 
     */
    addTag(target, tag) {
        if (target === 'user') {
            const newArray = this._userTags.trim().split(' ');
            newArray.push(tag);

            this._userTags = newArray.join(' ');
        }
        else {
            const newArray = this._tags.trim().split(' ');
            newArray.push(tag);

            this._tags = newArray.join(' ');
        }
    }

    /**     
     * @param {('user'|'tag')} target 
     * @param {String} tag 
     */
    removeTag(target, tag) {
        if (target === 'user') {
            this._userTags = this._userTags.trim().split(' ').filter(t => t !== tag).join(' ');
        }
        else {
            this._tags = this._tags.trim().split(' ').filter(t => t !== tag).join(' ');
        }
    }

    /**
     * Sets the fields of the picture from the provided object.
     * @method
     * @abstract
     * @param {Object} obj the object containing properties to be assigned to this instance.
     * @returns {void}
     */
    fromData(obj) { }
}