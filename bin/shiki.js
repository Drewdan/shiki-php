const shiki = require('shiki');
const fs = require('fs');
const path = require('path');

const arguments = JSON.parse(process.argv.slice(2));

const customLanguages = [
    {
        id: 'antlers',
        scopeName: 'text.html.statamic',
        path: getLanguagePath('antlers'),
    },
    {
        id: 'blade',
        scopeName: 'text.html.php.blade',
        path: getLanguagePath('blade'),
    }
];

if (arguments[0] === 'themes') {
    process.stdout.write(JSON.stringify(shiki.BUNDLED_THEMES));
    return;
}

let languages = shiki.BUNDLED_LANGUAGES;
languages.push(...customLanguages);

if (arguments[0] === 'languages') {
    process.stdout.write(JSON.stringify(languages));
    return;
}

const language = arguments[1] || 'php';
let theme = arguments[2] || 'nord';

languages = languages.filter(l => l.id === language || l.aliases?.includes(language));

if (fs.existsSync(theme)) {
    theme = JSON.parse(fs.readFileSync(theme, 'utf-8'));
}

shiki.getHighlighter({
    theme,
    langs: languages,
}).then((highlighter) => {
    process.stdout.write(highlighter.codeToHtml(arguments[0], language));
});

function getLanguagePath(language)
{
    const pathToShikiDistDirectory = path.dirname(require.resolve('shiki'));
    const pathToShikiLanguages = path.resolve(`${pathToShikiDistDirectory}/../languages`);
    const relativeDirectory = path.relative(pathToShikiLanguages, `${__dirname}/../languages`) ;

    return `${relativeDirectory}/${language}.tmLanguage.json`
}
