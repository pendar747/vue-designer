import * as fs from 'fs';
import * as ts from 'typescript';
import Project from './project';
import Asset from './asset';
import TranspiledAsset from './transpiled-asset';
import * as vm from 'vm';
import Path from './path';

export default class Script extends TranspiledAsset {
    protected _dependencies: Script[];

    protected scanDependencyPaths (): string[] {
        const source = ts.createSourceFile(
            this.path.basename,
            this.fileContent,
            this.compilerOptions.target || ts.ScriptTarget.ES5,
            true
        );

        const importedModules: string[] = [];
        const findImportPaths = (node: ts.Node): void => {
            if (ts.isImportDeclaration(node)) {
                const moduleName = node.moduleSpecifier.getText()
                    .replace(/["']/g, '');
                importedModules.push(moduleName);
            } else {
                node.forEachChild(findImportPaths);
            }
        };
 
        source.forEachChild(findImportPaths);

        return importedModules;
    }

    protected createDependencies () {
        this._dependencies = this.scanDependencyPaths()
            .map(mod => this._project.resolveDependency(this._path, mod))
            .map(path => new Script(path, this._project));
    }

    transpile () {
        const res = ts.transpileModule(this.fileContent, {
            compilerOptions: this.compilerOptions,
            moduleName: this.path.basename
        });
        this.transpiledContent = res.outputText;
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