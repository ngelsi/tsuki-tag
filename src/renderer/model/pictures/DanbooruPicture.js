import Picture from './Picture';

export default class DanbooruPicture extends Picture {

    constructor() {
        super();

        this._provider = "danbooru";
    }

    /**
     * Sets the fields of the picture from the provided object.
     * @method
     * @param {Object} obj 
     * @returns {void}
     */
    fromData(obj) {

        const heightRatio = 150 / obj.image_height;
        const widthRatio = 150 / obj.image_width;
        const lowerRatio = heightRatio < widthRatio ? heightRatio : widthRatio;

        this._id = obj.id ? obj.id.toString() : '';
        this._score = obj.score;
        this._parentId = obj.parent_id;
        this._hasChildren = obj.has_children;
        this._rating = obj.rating;
        this._tags = obj.tag_string;
        this._md5 = obj.md5;
        this._createdAt = obj.created_at;
        this._source = obj.source;
        this._status = '';
        this._createdBy = obj.uploader_id;
        this._previewHeight = obj.image_height * lowerRatio;
        this._previewWidth = obj.image_width * lowerRatio;
        this._previewUrl = obj.preview_file_url;
        this._width = obj.image_width;
        this._height = obj.image_height;
        this._url = obj.large_file_url;
        this._downloadUrl = obj.file_url;
    }
}