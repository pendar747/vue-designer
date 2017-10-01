import * as nodePath from 'path';
import * as assert from 'assert';
import * as os from 'os';

export default class Path {
    private _absolutePath: string;
    private static _resolver = (os.type() === 'Darwin' || os.type() === 'Linux')
        ? nodePath.posix
        : nodePath.win32;

    get absolutePath (): string {
        return this._absolutePath;
    }

    /**
     * all the segments of the path except the empty segments ('')
     * e.g. ['foo', 'bar'] for /foo/bar
     *      ['c:', 'Users', 'Fin'] for c:\\Users\\Fin
     */
    get segments (): string[] {
        return this._absolutePath
            .split(Path._resolver.sep)
            .filter(seg => seg.length);
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
        this._absolutePath = Path._resolver.normalize(absolutePath);
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
        const resolved = Path._resolver.resolve(this._absolutePath, path);
        return new Path(resolved);
    }

    /**
     * returns true if paths are equal
     * @param path path to another file or directory
     */
    isEqualTo (path: Path): boolean {
        return path.segments.length === this.segments.length
            && path.segments.every((seg, i) => this.segments[i] === seg);
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
        return new Path(Path.resolve(absolutePath, relativePath));
    }
}