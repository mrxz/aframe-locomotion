const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const typedocJson = JSON.parse(fs.readFileSync('../temp/docs.json'));
const types = {
    component: {},
    system: {},
    primitive: {},
};
const lookup = {};

const deriveTypeFromDefault = (defaultValue) => {
    if(typeof defaultValue === 'number') {
        return 'number';
    }
    if(typeof defaultValue === 'boolean') {
        return 'boolean';
    }
    if(typeof defaultValue === 'string') {
        return 'string';
    }
    return null;
}

// Source: https://stackoverflow.com/a/67243723
const kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())
const nameFromTypeName = (typeName) => {
    let result = kebabize(typeName);
    if(result.endsWith('-component')) {
        result = result.substring(0, result.lastIndexOf('-'));
    } else if(result.endsWith('-system')) {
        result = result.substring(0, result.lastIndexOf('-'));
    } else if(result.endsWith('-primitive')) {
        result = result.substring(0, result.lastIndexOf('-'));
    }
    return result;
}
const fileNameForTypeName = (declaration) => {
    // Note: derive path from source path while skipping (hard-coded) rootDir
    //       ideally a category annotation can be used to place it elsewhere
    let path = declaration.sources.length ? declaration.sources[0].fileName : '';
    path = path.substring(path.indexOf('/')+1, path.lastIndexOf('/'));
    return `${path}/${declaration.registeredName}.${declaration.kind}.md`;
}

function parseDeclaration(declaration, kind) {
    const result = {
        id: declaration.id,
        name: declaration.name,
        kind,
        sources: declaration.sources,
        comment: declaration.comment,
        schema: [],
        // FIXME: Ultimately should be the name that was used to register
        registeredName: nameFromTypeName(declaration.name),
        fileName: ''
    }
    result.fileName = fileNameForTypeName(result);

    const schemaTypeArgument = declaration.type.typeArguments[1];
    if(schemaTypeArgument.declaration.children) {
        for(const schemaProperty of schemaTypeArgument.declaration.children) {
            const schemaPropertyDetails = Object.fromEntries(schemaProperty.type.declaration.children.map(x => [x.name, x]));
            const property = {
                name: schemaProperty.name,
                comment: schemaProperty.comment,
                type: schemaPropertyDetails['type']?.type.value,
                default: schemaPropertyDetails['default']?.type.value,
            };
            if(!property.type) {
                property.type = deriveTypeFromDefault(property.default);
            }
            result.schema.push(property);
        }
    }

    return result;
}

const KINDS = {
    "ComponentConstructor": "component",
    "SystemConstructor": "system",
    "PrimitiveConstructor": "primitive",
};
for(const rawDeclaration of typedocJson.children) {
    const name = rawDeclaration.type.target.qualifiedName;
    const kind = KINDS[name];
    if(!kind) continue;

    const declaration = parseDeclaration(rawDeclaration, kind);
    if(declaration.name in types[kind]) {
        console.warn('Duplicate', kind, declaration.name);
    }
    types[kind][declaration.name] = declaration;
    lookup[declaration.id] = declaration;
}

handlebars.registerHelper('eq', function(arg1, arg2) {
    return (arg1 == arg2) ? true : false;
});

// HACK: Keep track of the current 'file' in order to output relative URLs
let compileContext = {
    currentFile: '',
    currentPath: '',
}
const fromCommentImpl = function(input, inline) {
    if(!input) {
        return '';
    }

    let result = '';
    for(const part of input) {
        if(part.kind === 'text') {
            result += part.text;
        } else if(part.tag === '@link') {
            const linked = lookup[part.target];
            if(linked) {
                const relativeUrl = path.relative(compileContext.currentPath, linked.fileName)
                result += `[\`${linked.registeredName}\`](${relativeUrl})`;
            } else {
                console.warn('Unknown link destination', part.text, part.target);
                result += `\`${part.text}\``;
            }
        } else if(part.kind === 'code') {
            result += part.text;
        } else {
            console.warn('Unsupported type', part.kind, part.tag);
        }
    }

    if(inline) {
        result = result.replace(/\n/g, ' ');
    }
    return new handlebars.SafeString(result);
}

handlebars.registerHelper('fromCommentInline', function(input) {
    return fromCommentImpl(input, true);
});

handlebars.registerHelper('fromComment', function(input) {
    return fromCommentImpl(input, false);
});

// FIXME: Pre-process for easier templating instead of doing double the work
handlebars.registerHelper('fromEmitsCommentName', function(input) {
    const result = fromCommentImpl(input, true);
    const rawResult = result.toString();
    return new handlebars.SafeString(rawResult.split(" ", 1)[0]);
});

handlebars.registerHelper('fromEmitsCommentDescription', function(input) {
    const result = fromCommentImpl(input, true);
    const rawResult = result.toString();
    return new handlebars.SafeString(rawResult.substring(rawResult.indexOf(" ")));
});

handlebars.registerHelper('containsTag', function(tag, tags) {
    return tags.some(t => t.tag === tag);
});


function ensureDirectoryExists(path) {
    if(!fs.existsSync(path)){
        fs.mkdirSync(path, { recursive: true });
    }
}

const compiled = {
    component: handlebars.compile(fs.readFileSync('../scripts/component-template.md').toString()),
    system: handlebars.compile(fs.readFileSync('../scripts/system-template.md').toString()),
    primitive: handlebars.compile(fs.readFileSync('../scripts/primitive-template.md').toString()),
};
for(const kind of Object.values(KINDS)) {
    for(const declaration of Object.values(types[kind])) {
        const fileName = declaration.fileName;
        compileContext.currentFile = fileName;
        compileContext.currentPath = fileName.substring(0, fileName.lastIndexOf('/'));

        const contents = compiled[kind](declaration);

        const fullPath = '../docs/reference/' + fileName;
        ensureDirectoryExists(fullPath.substring(0, fullPath.lastIndexOf('/')));
        fs.writeFileSync(fullPath, contents);
    }
}