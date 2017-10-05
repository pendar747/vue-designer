import * as fs from 'fs';
import * as ts from 'typescript';
import * as assert from 'assert';

import Project from '../general//project';
import Path from '../general//path';

export default class Asset {
    protected _path: Path;
    protected _rawContent: string;
    protected _project: Project;

    constructor (file: Path, project: Project) {
        this._path = file;
        this._project = project;
        this.readFile();
    }

    get path (): Path {
        return this._path;
    }

    /**
     * returns name of the file including the extension
     */
    private _getFullName (): string {
        const files = fs.readdirSync(this._path.directory.absolutePath);
        const pattern = new RegExp(this._path.basename);
        const possibilities = files.filter(file => pattern.test(file))
            .sort((a, b) => a.length - b.length);
        assert.ok(possibilities.length > 0, 
            `No file ${this._path.basename} found in ${this._path.directory.absolutePath}`);
        return possibilities[0];
    }

    /**
     * sets the path of the file to one that includes the extension
     */
    resolveExtension () {
        this._path = Path.join(this._path.directory.absolutePath, this._getFullName());
    }

    readFile () {
        this._rawContent = fs.readFileSync(
            this._path.absolutePath, 
            { encoding: 'utf8' }
        );
    }
    
}