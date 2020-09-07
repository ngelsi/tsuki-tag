import {
    remote
} from 'electron';

import fs from 'fs';
import path, { resolve } from 'path';
import Picture from "../model/pictures/Picture";
import Workspace from '../model/Workspace';
import Jimp from 'jimp';
import base64a from 'base64-arraybuffer';
import exif, { piexif } from 'piexifjs';
import { exit } from 'process';

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
                        metadata["0th"][exif.ImageIFD.XPKeywords] = this.convertStringToByteArray(picture.tags.join('; '))
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