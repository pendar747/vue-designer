import * as ts from 'typescript';

/**
 * Returns content of the script portion of the file
 * @param content content of the vue file
 */
const getScript = (content: string): string => {
    const lines = content.split('\n');
    const start = lines.findIndex(line => line.includes('<script'));
    const end = lines.findIndex(line => line.includes('script/>'));
    const scriptContent = lines.slice(start, end);
    console.log('Script Content:');
    console.log(scriptContent);
    return scriptContent.join('\n');
};

/**
 * Returned script content transpiled to es3
 * @param scriptContent content of the script
 */
const transpileScript = (scriptContent: string) => {
    const compilerOptions = { 
        module: ts.ModuleKind.CommonJS
    };
    
    const res1 = ts.transpileModule(scriptContent, {
        compilerOptions: compilerOptions,
        moduleName: 'myModule2'
    });
    return res1.outputText;
};

const createVuePreview = (fileContent: string) => {
    const scriptContent = getScript(fileContent);
    const es3 = transpileScript(scriptContent);
    console.log(es3);
};

export default createVuePreview;