import * as fs from 'fs';
import * as ts from 'typescript';
import Project from './project';
import Asset from './asset';
import TranspiledAsset from './transpiled-asset';
import vm from 'vm';
import Path from './path';

export default class Script extends TranspiledAsset {
    protected _dependencies: Script[];

    protected scanDependencyPaths (): Path[] {
        const source = ts.createSourceFile(
            this.path.basename,
            this.fileContent,
            this.compilerOptions.target || ts.ScriptTarget.ES5
        );
        const findImportPaths = (node: ts.ImportClause): Path => {
            const moduleName = node.getChildAt(0).getText();
            return this._project.resolvePathToDependency(this._path, moduleName);
        };
 
        return source.getChildren()
            .filter(node => ts.isImportClause(node))
            .map(findImportPaths);
    }

    protected createDependencies () {
        this._dependencies = this.scanDependencyPaths()
            .map(path => new Script(path, this._project));
    }

    transpile () {
        const res = ts.transpileModule(this.fileContent, {
            compilerOptions: this.compilerOptions,
            moduleName: this.path.basename
        });
        this.transpiledContent = res.outputText;
        console.log(this.transpiledContent);
        this.createDependencies();
    }

    run () {
        const vmOptions: vm.ScriptOptions = {
            filename: this.path.absolutePath
        };
        const virtualScript = new vm.Script(this.transpiledContent, vmOptions);
        const sandbox = {
            module: {}
        };
        const context = vm.createContext(sandbox);
        virtualScript.runInContext(context);
    }

}