import test from 'ava';
import Path from './path';
import * as sionon from 'sinon';
import * as os from 'os';


test('should reject non absolute paths', t => {
    t.throws(() => {
        new Path('../foo');
    });
    t.notThrows(() => {
        new Path('C:\\Users\\foo\\vue-designer');
    });
});

test('should get the basename and directory', t => {
    const path = new Path('C:\\Users\\foo\\vue-designer');
    t.is(path.basename, 'vue-designer');
    t.is(path.directory.absolutePath, 'C:\\Users\\foo');
});

test('resolves the absolute path to a path relative to this one', t => {
    const path = new Path('C:\\Users\\foo\\vue-designer');
    const other = path.resolvePathTo('../bar');
    t.is(other.absolutePath, 'C:\\Users\\foo\\bar');

    const other2 = path.resolvePathTo('./nam/num');
    t.is(other2.absolutePath, 'C:\\Users\\foo\\vue-designer\\nam\\num');
});

test('can correctly check equality and splitting paths to segments', t => {
    const path = new Path('C:\\Users\\foo\\vue-designer');
    const path2 = new Path('C:/Users/foo/vue-designer');
    t.deepEqual(path.segments, path2.segments);

    t.true(path.isEqualTo(path2));

    const path3 = new Path('C:/foo/bar');
    t.false(path3.isEqualTo(path));
});

test('can create a path given an absolute and a relative path', t => {
    const path = Path.createPathFrom('../foo/bar', 'c:/Users/Public');
    t.is(path.absolutePath, 'c:\\Users\\foo\\bar');

    t.throws(() => {
        Path.createPathFrom('c:\\foo', 'c:\\bar');
    }, /relativePath|relative/);
    t.throws(() => {
        Path.createPathFrom('./foo', '../bar/foo');
    }, /absolutePath|absolute/);
});

test.only('must get the correct platform resolver', t => {
    const osType = sionon.stub(os, 'type').returns('Linux');

    const path = new Path('\\foo\\bar');
    t.deepEqual(path.segments, ['foo', 'bar']);

    osType.returns('Windows_NT');
    const path2 = new Path('c:\\foo\\bar');
    t.deepEqual(path2.segments, ['c:', 'foo', 'bar']);

    osType.restore();
});