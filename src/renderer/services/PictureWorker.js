import {
    remote
} from 'electron';

import fs from 'fs';
import url from 'url';
import crypto from 'crypto';
import path, { resolve } from 'path';
import Picture from "../model/pictures/Picture";
import Workspace from '../model/Workspace';
import Jimp from 'jimp';
import base64a from 'base64-arraybuffer';
import exif, { piexif } from 'piexifjs';
import { exit } from 'process';
import DataStore from './DataStore';
import FavoritePictures from '../model/FavoritePictures';
import WorkspacePicture from '../model/pictures/WorkspacePicture';
import StringUtils from './StringUtils';
import { t } from './Localizer';
import WorkspacePictures from '../model/WorkspacePictures';

export default class PictureWorker {

    /** 
     * @param {String} url
     * @param {Buffer} existingBuffer     
     * @returns {Promise}
     */
    downloadPicture(url, existingBuffer) {

        if (existingBuffer && existingBuffer.length) {
            return Promise.resolve(existingBuffer);
        }

        if (url.startsWith('file')) {
            return new Promise((resolve, reject) => {
                const path = decodeURI(url.replace('file:///', ''));
                fs.readFile(path, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }
        else
            return new Promise((resolve, reject) => {
                const request = remote.net.request(url);
                let buffer = null;
                console.log("url", url);

                request.on("response", (response) => {
                    if (response.statusCode === 200) {
                        response.on("end", () => {
                            resolve(buffer);
                        });
                        response.on("data", (/** @type {Buffer} */ data) => {
                            if (!buffer) {
                                buffer = data;
                            } else {
                                buffer = Buffer.concat([buffer, data]);
                            }
                        });
                    } else {
                        reject(response.statusMessage);
                    }
                });

                request.end();
            });
    }

    /**
     * 
     * @param {Picture} picture 
     * @param {Workspace} workspace
     * @param {String} path
     * @returns {Promise}
     */
    AddToWorkspacePictures(picture, workspace, path) {

        return new Promise((resolve, reject) => {
            let pictureData = {};
            const heightRatio = 150 / picture.height;
            const widthRatio = 150 / picture.width;

            const lowerRatio = heightRatio < widthRatio ? heightRatio : widthRatio;
            const scaledHeight = picture.height * lowerRatio;
            const scaledWidth = picture.width * lowerRatio;

            pictureData.width = picture.width;
            pictureData.height = picture.height;
            pictureData.provider = workspace ? workspace.name : 'workspace';
            pictureData.previewWidth = scaledWidth;
            pictureData.previewHeight = scaledHeight;
            pictureData.path = path;
            pictureData.url = new url.URL(`file:///${path}`).href;
            pictureData.previewUrl = pictureData.url;
            pictureData.id = picture.id;
            pictureData.provider = picture.provider;
            pictureData.md5 = picture.md5;
            pictureData.source = picture.source;
            pictureData.downloadurl = picture.downloadUrl;
            pictureData.rating = picture.rating;
            pictureData.score = picture.score;
            pictureData.tags = picture.tagString;
            pictureData.workspace = workspace.name;

            const workspacePicture = new WorkspacePicture();
            workspacePicture.fromData(pictureData);

            DataStore.defaults[WorkspacePictures.name] = WorkspacePictures.default;
            var dataStore = new DataStore();
            dataStore.get(WorkspacePictures.name).then((/** @type {WorkspacePictures} */ workspacePictures) => {

                if (workspacePictures.pictures.filter(p => p._md5 === picture.md5).length) {
                    workspacePictures.pictures = workspacePictures.pictures.filter(p => p._md5 !== picture.md5);
                }

                workspacePictures.pictures.push(workspacePicture);

                dataStore.set(WorkspacePictures.name, workspacePictures)
                    .then(() => {
                        DataStore.cache[WorkspacePictures.name] = null;
                        resolve();
                    })
                    .catch((err) => {
                        console.log('ERR', err);
                        reject();
                    });
            })
                .catch(err => {
                    console.log('ERR', err);
                    reject();
                });
        });
    }

    /**     
     * @param {String} path 
     * @param {Workspace} workspace
     * @returns {Promise<Picture>}
     */
    getLocalPicture(path, workspace) {
        return new Promise((resolve, reject) => {

            let pictureData = {};

            Jimp.read(path, (err, image) => {
                if (err) {
                    reject(err);
                }
                else {

                    const heightRatio = 150 / image.getHeight();
                    const widthRatio = 150 / image.getWidth();

                    const lowerRatio = heightRatio < widthRatio ? heightRatio : widthRatio;
                    const scaledHeight = image.getHeight() * lowerRatio;
                    const scaledWidth = image.getWidth() * lowerRatio;

                    pictureData.width = image.getWidth();
                    pictureData.height = image.getHeight();
                    pictureData.provider = workspace ? workspace.name : 'workspace';
                    pictureData.workspace = workspace ? workspace.name : '';
                    pictureData.previewWidth = scaledWidth;
                    pictureData.previewHeight = scaledHeight;
                    pictureData.path = path;

                    image.getBuffer(image.getMIME(), (err, buffer) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const binary = buffer.toString("binary");

                            let metadata;
                            let tagArray;
                            let attributeArray;

                            try {
                                metadata = exif.load(binary);
                                tagArray = metadata["0th"][exif.ImageIFD.XPKeywords];
                                attributeArray = metadata["0th"][exif.ImageIFD.XPComment];
                            } catch (er) {
                                console.log('metadata error', er);
                            }

                            if (tagArray) {
                                let tagString = String.fromCharCode.apply(null, tagArray);
                                if (tagString) {
                                    tagString = tagString.replace(/\u0000/g, '').replace(/\s/g, '').replace(/;/g, ' ');
                                    pictureData.tags = tagString;
                                }
                            }

                            if (attributeArray) {
                                let attributeString = String.fromCharCode.apply(null, attributeArray);
                                if (attributeString) {
                                    attributeString = attributeString.replace(/\u0000/g, '');
                                    const attributeParts = attributeString.split('\r\n');
                                    attributeParts.forEach((/** @type {String} */ part) => {
                                        const index = part.indexOf(':');
                                        const propertyParts = part.split(':');
                                        if (propertyParts.length >= 2) {
                                            pictureData[propertyParts[0].toLowerCase()] = part.substr(index + 2, part.length - (index + 2)).trim();
                                        }
                                    });
                                }
                            }

                            if (!pictureData.tags) {
                                pictureData.tags = '';
                            }

                            pictureData.url = new url.URL(`file:///${path}`).href;
                            pictureData.previewUrl = pictureData.url;

                            if (pictureData.md5) {
                                const picture = new WorkspacePicture();
                                picture.fromData(pictureData);
                                resolve(picture);
                            } else {
                                this.checksumFile(path)
                                    .then((md5) => {
                                        pictureData.md5 = md5;

                                        const picture = new WorkspacePicture();
                                        picture.fromData(pictureData);

                                        resolve(picture);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            }
                        }
                    });
                }
            });
        });
    }

    /**
     * @param {String} path 
     * @param {String?} hashName 
     * @returns {Promise<String>}
     */
    checksumFile(path, hashName) {
        return new Promise((resolve, reject) => {
            if (!hashName) {
                hashName = 'sha1';
            }

            const hash = crypto.createHash(hashName);
            const stream = fs.createReadStream(path);
            stream.on('error', err => reject(err));
            stream.on('data', chunk => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('hex')));
        });
    }

    /**
     *  @param {String} extension
     *  @param {Buffer} buffer     
     *  @returns {String}     
     */
    convertToSrc(extension, buffer) {
        const base64 = this.convertToBase64(buffer);
        return 'data:' + `image/${extension}` + ';base64,' + base64;
    }

    /**
     *  @param {Buffer} buffer
     *  @returns {String}     
     */
    convertToBase64(buffer) {
        return base64a.encode(buffer);
    }

    /**     
     * @param {String} str 
     * @returns {Buffer}
     */
    convertFromBase64(str) {
        return base64a.decode(str);
    }

    /**     
     * @param {String} str 
     * @returns {Array<number>}
     */
    convertStringToByteArray(str) {
        var byteArray = [];
        var buffer = new Buffer(str, 'utf16le');

        for (var i = 0; i < buffer.length; i++) {
            byteArray.push(buffer[i]);
        }

        return byteArray;
    }

    /**
     * @param {Buffer} buffer 
     * @param {Picture} picture 
     * @param {Boolean} isjpg
     * @param {Boolean} includeTags 
     * @param {Boolean} includeMetadata 
     * @returns {Promise}
     */
    processMetadata(buffer, picture, isjpg, includeTags, includeMetadata) {
        if (!isjpg || (!includeMetadata && !includeTags)) {
            return Promise.resolve(buffer);
        }
        else {

            return new Promise((resolve, reject) => {
                try {
                    const binary = buffer.toString("binary");
                    const metadata = exif.load(binary);
                    metadata["0th"][exif.ImageIFD.Software] = "Tsuki-tag";

                    if (includeTags) {
                        metadata["0th"][exif.ImageIFD.XPKeywords] = this.convertStringToByteArray(picture.tags.concat(picture.userTags).join('; '))
                    }

                    if (includeMetadata) {
                        metadata["0th"][exif.ImageIFD.XPComment] = this.convertStringToByteArray(picture.metadata.join('\r\n'));
                    }

                    const metadataBinary = exif.dump(metadata);
                    const newBinary = exif.insert(metadataBinary, binary);

                    const newBuffer = Buffer.from(newBinary, "binary");
                    resolve(newBuffer);
                }
                catch (err) {
                    reject(err);
                }
            });
        }
    }

    /**     
     * @param {String} path 
     * @param {Buffer} buffer 
     * @returns {Promise}
     */
    savePicture(path, buffer) {

        return new Promise((resolve, reject) => {
            fs.open(path, 'w', function (err, fd) {
                if (err) {
                    reject(err);
                }
                else {
                    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            fs.close(fd, (err) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    /**
     * @param {Picture} picture
     * @returns {Promise}
     */
    delete(picture) {
        return new Promise((resolve, reject) => {
            if (picture.path && picture.workspace) {
                fs.unlink(picture.path, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (picture.favorite) {
                            this.favorite(picture)
                                .then(() => {
                                    resolve();
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        } else {
                            resolve();
                        }
                    }
                })
            } else {
                reject('no path exists for picture');
            }
        });
    }

    /**
     * @param {Picture} picture 
     * @returns {Promise}
     */
    favorite(picture) {
        return new Promise((resolve, reject) => {
            this.getFavorite(picture)
                .then(favorite => {
                    DataStore.defaults[FavoritePictures.name] = FavoritePictures.default;
                    var dataStore = new DataStore();
                    dataStore.get(FavoritePictures.name)
                        .then((/** @type {FavoritePictures} */ favoritePictures) => {

                            if (favorite) {
                                picture._favorite = false;
                                favoritePictures.pictures = favoritePictures.pictures.filter(p => p._md5 !== picture._md5);
                            }
                            else {
                                picture._favorite = true;
                                favoritePictures.pictures.push(picture);
                            }

                            dataStore.set(FavoritePictures.name, favoritePictures)
                                .then(() => {
                                    resolve();
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**     
     * @param {Picture} picture 
     * @returns {Promise<Boolean>}
     */
    getFavorite(picture) {
        return new Promise((resolve, reject) => {
            DataStore.defaults[FavoritePictures.name] = FavoritePictures.default;
            var dataStore = new DataStore();
            dataStore.get(FavoritePictures.name)
                .then((/** @type {FavoritePictures} */ favoritePictures) => {
                    const exists = favoritePictures.pictures && favoritePictures.pictures.length && favoritePictures.pictures.filter(p => p._md5 === picture._md5).length > 0;
                    resolve(exists);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * 
     * @param {Buffer} buffer 
     */
    //https://github.com/oliver-moran/jimp/tree/master/packages/jimp#writing-to-buffers
    convertPictureToJpg(buffer, isjpg) {

        if (isjpg) {
            return Promise.resolve(buffer);
        }

        return new Promise((resolve, reject) => {
            Jimp.read(buffer, (err, image) => {
                if (err) {
                    reject(err);
                }
                else {
                    image.getBuffer(Jimp.MIME_JPEG, (err, newBuffer) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(newBuffer);
                        }
                    });
                }
            });
        });
    }
}