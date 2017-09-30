import Script from './script';
import Path from './path';
import * as ts from 'typescript';

export default class Project {
    private _rootPath: Path;
    private static _absolutePattern: RegExp = new RegExp(/^\.+[\/\\]/).compile();

    get rootPath () {
        return this._rootPath;
    }

    constructor (rootPath: Path) {
        this._rootPath = rootPath;
    }

    static moduleIsAbsolute (moduleName: string): boolean {
        return this._absolutePattern.test(moduleName);
    }

    resolveAbsoluteModule (moduleName: string): Path {
        return new Path('/');
    }

    resolveDependency (file: Path, dependencyPath: string) {
        return Project.moduleIsAbsolute(dependencyPath)
            ? this.resolveAbsoluteModule(dependencyPath)
            : file.resolvePathTo(dependencyPath);
    }
        
}