import * as fs from 'fs';
import * as ts from 'typescript';
import Project from './project';

export default class Asset {
    protected _path: string;
    protected fileContent: string;
    protected _project: Project;

    constructor (filePath: string, project: Project) {
        this._path = filePath;
        this._project = project;
    }

    get fileName () {
        return 'foo';
    }

    get path () {
        return this._path;
    }

    readFile () {
        this.fileContent = fs.readFileSync(this._path, { encoding: 'utf8' });
    }
    
}