import Script from './script';

export default class Project {
    private _rootPath;

    get rootPath () {
        return this._rootPath;
    }

    constructor (rootPath: string) {
        this._rootPath = rootPath;
    }

    static moduleIsAbsolute (moduleName: string): boolean {
        return true;
    }
    
    resolveModulePath (moduleName: string): string {
        return '';
    }
    
    extractNodeModule (packageName: string): Script {
        return new Script('', this._rootPath);
    }
}