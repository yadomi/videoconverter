const watchr = require('watchr')
const mime = require('mime')
const ffmpeg = require('fluent-ffmpeg')
const chalk = require('chalk');
const fg = require('fast-glob');
const { join, basename, resolve } = require('path')
const { writeFileSync } = require('fs');

const { SOURCE_PATH } = process.env;
const DEST_PATH = resolve('./public/videos/');
console.log({ DEST_PATH });

if (!SOURCE_PATH) {
    console.log(chalk.red('You must define SOURCE_PATH variable'))
    process.exit(2);
}

const convert = path => {
    const now = new Date().getTime().toString();
    const dest = join(DEST_PATH, `${now}.mp4`);
    console.log(chalk.cyan(`New video detected, will convert ${chalk.yellow(path)} to ${chalk.yellow(dest)}`));

    ffmpeg(path)
        .withVideoCodec('libx264')
        .withVideoFilter('scale=720:-2')
        .withOutputOption('-crf 20')
        .withOutputFPS(30)
        .save(dest)
        .on('error', error => {
            console.error(error)
        })
        .on('end', () => {
            console.log(chalk.green(`Video converted in ${chalk.yellow(dest)}`));
            generateStaticJSON();
        })
}

const listener = (changeType, path) => {
    if (changeType === 'create' && mime.getType(path) === 'video/mp4') {
        convert(path)
    }
}

const stalker = watchr.open(SOURCE_PATH, listener, (err) => {
    if (err) console.error(chalk.red(err));
})

const generateStaticJSON = () => {
    const files = fg.sync(['*.mp4'], {
        cwd: DEST_PATH,
        onlyFiles: true,
    });

    writeFileSync('./src/videos.json', JSON.stringify(files));
}

console.log(chalk.green(`Watching directory ${chalk.bold(SOURCE_PATH)}`))
generateStaticJSON();