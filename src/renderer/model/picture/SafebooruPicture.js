import Picture from './Picture';

export default class SafebooruPicture extends Picture {

    constructor() {
        super();

        this._provider = "safebooru";
    }

    /**
     * Sets the fields of the picture from the provided object.
     * @method
     * @param {Object} obj the object containing properties to be assigned to this instance.
     * @returns {void}
     */
    fromData(obj) {
        this._id = obj.id ? obj.id.toString() : '';
        this._score = obj.score;
        this._parentId = obj.parent_id;
        this._hasChildren = obj.has_children;
        this._rating = obj.rating;
        this._tags = obj.tags;
        this._md5 = obj.md5;
        this._createdAt = obj.created_at;
        this._source = obj.source;
        this._status = obj.status;
        this._createdBy = obj.creator_id;
        this._previewHeight = parseInt(obj.preview_height);
        this._previewWidth = parseInt(obj.preview_width);
        this._previewUrl = obj.preview_url;
        this._width = parseInt(obj.width);
        this._height = parseInt(obj.height);
        this._url = obj.file_url;
    }
}