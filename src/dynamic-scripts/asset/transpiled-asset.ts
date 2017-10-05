import * as fs from 'fs';
import * as ts from 'typescript';
import Project from '../general//project';
import Asset from './asset';
import Path from '../general//path';

export default abstract class TranspiledAsset extends Asset {
    protected transpiledContent: string;
    protected _dependencies: TranspiledAsset[] = [];

    protected  compilerOptions: ts.CompilerOptions = { 
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2015,
        allowJS: true
    };

    get dependencies (): TranspiledAsset[] {
        return this._dependencies;
    }
    
    /**
     * given a path finds its corresponding dependency in the dependency tree
     * @param filePath file path for a dependency
     */
    findDependency (filePath: Path): TranspiledAsset | undefined {
        let result;
        this._dependencies.forEach(dep => {
            result = dep.path.isEqualTo(filePath)
                ? dep
                : dep.findDependency(filePath);
        });
        return result;
    }
    
    protected abstract createDependencies (): void;

    abstract transpile (): void;
}