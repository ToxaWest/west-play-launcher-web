import fs from 'node:fs'
import path from 'node:path'

function fromDir(startPath, filter, callback) {
    if (!fs.existsSync(startPath)) return;

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, callback); //recurse
        } else if (filename.endsWith(filter)) {
            callback(filename);
        }
    }
}

const getKeys = async (ext) => new Promise((resolve) => {
    const result = []

    fromDir('./src', ext, (file_path) => {
        const file_messages = fs.readFileSync(file_path, 'utf8').toString();
        const match = file_messages.matchAll(/i18n\.t\((['"])(.*?)(['"])/gm)
        match.forEach(a => {
            if (result.includes(a[2])) return;
            result.push(a[2])
        })
    })
    resolve(result)
})

const jsonFiles = [
    'polish.json',
    'ukrainian.json',
    'english.json',
    'russian.json',
    'french.json',
    'german.json'
]

const translations = (async () => {
    const a = await getKeys('.tsx')
    const b = await getKeys('.ts')
    const translationKeys = [...new Set([...a, ...b])];

    for (const file of jsonFiles) {
        const givenTraslKeys = [];
        const res = fs.readFileSync(`./src/i18n/${file}`, 'utf8').toString()
        const json = JSON.parse(res)
        translationKeys.forEach(key => {
            givenTraslKeys.push(key)
            if (!Object.hasOwn(json, key)) {
                console.log('add:', key)
                json[key] = '';
            }
        })
        Object.keys(json).forEach(key => {
            if (!givenTraslKeys.includes(key)) {
                console.log('remove:', key)
                delete json[key]
            }
        })
        fs.writeFileSync(`./src/i18n/${file}`, JSON.stringify(json, null, 4), 'utf8')
    }
})

translations();
