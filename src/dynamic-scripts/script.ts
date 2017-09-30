import * as fs from 'fs';
import * as ts from 'typescript';
import Project from './project';
import Asset from './asset';
import TranspiledAsset from './transpiled-asset';
import vm from 'vm';

export default class Script extends TranspiledAsset {
    protected _dependencies: Script[];

    protected scanDependencies () {
        const source = ts.createSourceFile(
            this.fileName,
            this.fileContent,
            this.compilerOptions.target || ts.ScriptTarget.ES5
        );
        const findImports = (node: ts.ImportClause): Script => {
            const moduleNode = node.getChildAt(0);
            const moduleName = moduleNode.getText();
            console.log(moduleName);
            const isAbsolute = Project.moduleIsAbsolute(moduleName);
            const path = isAbsolute
                ? moduleName
                : this._project.resolveModulePath(moduleName);
            return isAbsolute
                ? this._project.extractNodeModule(path)
                : new Script(path, this._project);
        };

        this._dependencies = source.getChildren()
            .filter(node => ts.isImportClause(node))
            .map(findImports);
        console.log(this._dependencies); 
    }

    transpile () {
        const res = ts.transpileModule(this.fileContent, {
            compilerOptions: this.compilerOptions,
            moduleName: this.fileName
        });
        this.transpiledContent = res.outputText;
        console.log(this.transpiledContent);
        this.scanDependencies();
    }

    run () {
        const vmOptions: vm.ScriptOptions = {
            filename: this.path
        };
        const virtualScript = new vm.Script(this.transpiledContent, vmOptions);
        const sandbox = {
            module: {}
        };
        const context = vm.createContext(sandbox);
        virtualScript.runInContext(context);
    }

}