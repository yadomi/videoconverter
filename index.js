const watchr = require('watchr')
const mime = require('mime')
const ffmpeg = require('fluent-ffmpeg')
const { join, basename } = require('path')

const [sourcePath, destinationPath] = process.argv.slice(2)

const convert = function(path) {
  const dest = join(destinationPath, basename(path))
  console.log('New video detected, will convert', path)

  ffmpeg(path)
    .withVideoCodec('h264_nvenc')
    .withSize('720x?')
    .preset('default')
    .save(dest)
    .on('end', function() {
      console.log('Video converted in', dest)
    })
}

const listener = function(changeType, path) {
  if (changeType === 'create' && mime.getType(path) === 'video/mp4') {
    convert(path)
  }
}

function next(err) {
  if (err) console.log(err)
}

const stalker = watchr.open(sourcePath, listener, next)
