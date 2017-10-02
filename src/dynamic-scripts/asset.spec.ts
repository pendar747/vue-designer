import test from 'ava';
import Asset from './asset';
import Project from './project';
import Path from './path';
import * as fs from 'fs';
import * as sinon from 'sinon';

test('Can resolve the asset file extension', t => {
    const sandbox = sinon.sandbox.create();
    const project = new Project(new Path('/foo/bar'));
    class TestAsset extends Asset {
        readFile () {}
    }
    const readdir = sandbox.stub(fs, 'readdirSync');
    
    let asset = new TestAsset(new Path('/foo/bar/ba'), project);
    readdir.returns(['ba.spec.js', 'ba.js']);
    asset.resolveExtension();
    t.true(asset.path.isEqualTo(new Path('/foo/bar/ba.js')));

    asset = new TestAsset(new Path('/foo/bar/ba'), project);
    readdir.returns(['ba.spec.js', 'ba.ts']);
    asset.resolveExtension();
    t.true(asset.path.isEqualTo(new Path('/foo/bar/ba.ts')));

    
    asset = new TestAsset(new Path('/foo/bar/ba'), project);
    readdir.returns(['ba.jpeg']);
    asset.resolveExtension();
    t.true(asset.path.isEqualTo(new Path('/foo/bar/ba.jpeg')));
    
    asset = new TestAsset(new Path('/foo/bar/ba'), project);
    readdir.returns(['foo.js']);
    t.throws(() => {
        asset.resolveExtension();
    }, /No file|found in/);
});