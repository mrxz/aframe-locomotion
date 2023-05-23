const fs = require('fs');
const handlebars = require('handlebars');

const typedocJson = JSON.parse(fs.readFileSync('../temp/docs.json'));
const types = {
    components: {},
    systems: {},
    primitives: {},
};

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

function parseDeclaration(declaration) {
    const result = {
        name: declaration.name,
        sources: declaration.sources,
        comment: declaration.comment,
        schema: []
    }

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
for(const declaration of typedocJson.children) {
    const name = declaration.type.target.qualifiedName;
    if(name === "ComponentConstructor" ) {
        const component = parseDeclaration(declaration);
        if(component.name in types.components) {
            console.warn('Duplicate component', component.name);
        }
        types.components[component.name] = component;
    } else if(name === "SystemConstructor") {
        const system = parseDeclaration(declaration);
        if(system.name in types.systems) {
            console.warn('Duplicate system', system.name);
        }
        types.systems[system.name] = system;
    } else if(name === "PrimitiveConstructor") {
        const primitive = parseDeclaration(declaration);
        if(primitive.name in types.primitives) {
            console.warn('Duplicate primitive', primitive.name);
        }
        types.primitives[primitive.name] = primitive;
    }
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
const fileNameForTypeName = (typeName) => {
    let result = kebabize(typeName);
    if(result.endsWith('-component')) {
        result = result.substring(0, result.lastIndexOf('-'));
        result += '.component';
    } else if(result.endsWith('-system')) {
        result = result.substring(0, result.lastIndexOf('-'));
        result += '.system';
    } else if(result.endsWith('-primitive')) {
        result = result.substring(0, result.lastIndexOf('-'));
        result += '.primitive';
    }
    return result + '.md';
}

handlebars.registerHelper('eq', function(arg1, arg2) {
    return (arg1 == arg2) ? true : false;
});

handlebars.registerHelper('nameFromTypeName', nameFromTypeName);

const fromCommentImpl = function(input, inline) {
    if(!input) {
        return '';
    }

    let result = '';
    for(const part of input) {
        if(part.kind === 'text') {
            result += part.text;
        } else if(part.tag === '@link') {
            const link = part.text;
            const filename = fileNameForTypeName(link);
            if(link in types.components) {
                result += `[\`${filename.substring(0, filename.indexOf('.'))}\`](./${filename})`;
            } else if(link in types.systems) {
                result += `[\`${filename.substring(0, filename.indexOf('.'))}\`](./${filename})`;
            } else {
                console.warn('Unknown link destination', link);
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

const compiled = {
    component: handlebars.compile(fs.readFileSync('../scripts/component-template.md').toString()),
    system: handlebars.compile(fs.readFileSync('../scripts/system-template.md').toString()),
    primitive: handlebars.compile(fs.readFileSync('../scripts/primitive-template.md').toString()),
};
for(const component of Object.values(types.components)) {
    const path = fileNameForTypeName(component.name);

    const contents = compiled.component(component);
    fs.writeFileSync('../temp/output/' + path, contents);
}
for(const system of Object.values(types.systems)) {
    const path = fileNameForTypeName(system.name);

    const contents = compiled.system(system);
    fs.writeFileSync('../temp/output/' + path, contents);
}
for(const primitive of Object.values(types.primitives)) {
    const path = fileNameForTypeName(primitive.name);

    const contents = compiled.primitive(primitive);
    fs.writeFileSync('../temp/output/' + path, contents);
}