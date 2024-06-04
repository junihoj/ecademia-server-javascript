import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export async function mailCustomizer(htmlFilePath, replacements) {
    const filePath = path.join(__dirname, htmlFilePath);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const htmlToSend = template(replacements);
    return htmlToSend;
}

// handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
//   return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
// });


// handlebars.registerHelper('ifEquals', function(this: typeof handlebars, arg1, arg2, options) { ... });

// handlebars.registerHelper('check', function (value, comparator) {
//     return (value === comparator) ? 'No content' : value;
// });