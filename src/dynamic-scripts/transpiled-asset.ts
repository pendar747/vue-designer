import * as fs from 'fs';
import * as ts from 'typescript';
import Project from './project';
import Asset from './asset';
import Path from './path';

export default abstract class TranspiledAsset extends Asset {
    protected transpiledContent: string;
    protected _dependencies: TranspiledAsset[] = [];

    protected  compilerOptions: ts.CompilerOptions = { 
        module: ts.ModuleKind.System,
        target: ts.ScriptTarget.ES2015,
        allowJS: true
    };

    get dependencies (): TranspiledAsset[] {
        return this.dependencies;
    }
    
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