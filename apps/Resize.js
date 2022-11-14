// Resize.js

const sharp = require('sharp');
//const uuidv4 = require('uuid/v4');
const { uuid } = require('uuidv4');
const path = require('path');

console.log(uuid());


class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);


    await sharp(buffer)
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFormat("jpeg")
        .jpeg({ quality: 90 })



/*
      await sharp(buffer)
        .resize(40, 40)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`upload/${filename}`);
*/

      .toFile(filepath);
    
    return filename;
  }
  static filename() {
    return `${uuid()}.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}
module.exports = Resize;