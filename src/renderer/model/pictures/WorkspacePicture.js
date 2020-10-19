import Picture from './Picture';

export default class WorkspacePicture extends Picture {

    constructor() {
        super();

        this._provider = "workspace";

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._path = '';

        /**
         * @member
         * @protected
         * @type {String}
         */
        this._workspace = '';
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get path() {
        return this._path;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get workspace() {
        return this._workspace;
    }

    /**
     * Sets the fields of the picture from the provided object.
     * @method
     * @param {Object} obj the object containing properties to be assigned to this instance.
     * @returns {void}
     */
    fromData(obj) {
        this._id = obj.id ? obj.id.toString() : '' || obj._id || '';
        this._provider = obj.provider || obj._provider;
        this._rating = obj.rating || obj._rating;
        this._tags = obj.tags || obj._tags;
        this._md5 = obj.md5 || obj._md5;
        this._source = obj.source || obj._source;
        this._score = obj.score ? parseInt(obj.score) : obj._score ? parseInt(obj._score) : 0;
        this._previewHeight = obj.previewHeight || obj._previewHeight;
        this._previewWidth = obj.previewWidth || obj._previewWidth;
        this._previewUrl = obj.previewUrl || obj._previewUrl;
        this._downloadUrl = obj.downloadurl || obj._downloadurl || obj.url || obj._url;
        this._width = obj.width || obj._width;
        this._height = obj.height || obj._height;
        this._url = obj.url || obj._url;
        this._path = obj.path || obj._path;
        this._workspace = obj.workspace || obj._workspace;
    }
}