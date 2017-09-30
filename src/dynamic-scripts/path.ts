import nodePath from 'path';
import assert from 'assert';
import os from 'os';

export default class Path {
    private _absolutePath: string;
    private static _resolver = (os.type() === 'Darwin' || os.type() === 'Linux')
        ? nodePath.posix
        : nodePath.win32;

    get absolutePath (): string {
        return this.absolutePath;
    }

    private static resolve = Path._resolver.resolve;

    /**
     * returns true if the given path is absolute
     */
    static isAbsolute = Path._resolver.isAbsolute;

    constructor (absolutePath: string) {
        assert.ok(
            Path._resolver.isAbsolute(absolutePath), 
            'The given path must be absolute.'
        );
        this._absolutePath = absolutePath;
    }

    /**
     * path basename: e.g. foo.js for /ab/c/d/foo.js
     */
    get basename (): string {
        return Path._resolver.basename(this._absolutePath);
    }

    get directory (): Path {
        return new Path(Path._resolver.dirname(this._absolutePath));
    }

    /**
     * Resolves the absolute path to a path relative to this file
     * @param path relative path to another file
     */
    resolvePathTo (path: string): Path {
        assert.ok(!Path.isAbsolute(path), 'path must be relative');
        return new Path(Path._resolver.resolve([this._absolutePath, path]));
    }

    /**
     * returns true if paths are equal
     * @param path path to another file or directory
     */
    isEqualTo (path: Path): boolean {
        return this._absolutePath === path.absolutePath;
    }

    /**
     * returns a new Path for the the given path relative to the absolutePath
     * @param relativePath a path relative to an absolute path
     * @param absolutePath the absolute path to base the resolution on
     */
    static createPathFrom(relativePath: string, absolutePath: string): Path {
        assert.ok(
            !Path.isAbsolute(relativePath), 
            'relativePath must be relative'
        );
        assert.ok(
            Path.isAbsolute(absolutePath),
            'absolutePath must be absolute'
        );
        return new Path(Path.resolve([absolutePath, relativePath]));
    }
}