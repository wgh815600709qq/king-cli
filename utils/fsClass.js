const path = require('path');
const rootPath = path.resolve(__dirname, '../');
const fs = require('fs');

function getPackageInfo(pathway) {
    const content = fs.readFileSync(pathway).toString();
    let result;
    try {
        result = JSON.parse(content);
    } catch(e) {
        if (e) return {}
    }
    return result;
}

function getPackageVersion() {
    const info = getPackageInfo(path.resolve(rootPath, 'package.json'))
    return info.version
}

function copyDir(src, dest) {
    if (fs.existsSync(dest) === false) {
        fs.mkdirSync(dest);
    }
    if (fs.existsSync(src) === false) {
        console.warn(src + 'is not exist')
        return false
    }
    const dirs = fs.readdirSync(src);
    dirs.forEach(function(item) {
        let itemPath = path.join(src, item);
        let temp = fs.statSync(itemPath);
        if (temp.isFile()) {
            fs.copyFileSync(itemPath, path.join(dest, item));
        } else if (temp.isDirectory()) {
            copyDir(itemPath, path.join(dest, item));
        }
    })
}

module.exports = {
    getPackageInfo,
    getPackageVersion,
    copyDir
}