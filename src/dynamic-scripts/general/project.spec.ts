import test from 'ava';
import Project from './project';
import Path from './path';

import * as fs from 'fs';
import * as sinon from 'sinon';

let sandbox: sinon.SinonSandbox;

test.before(() => {
    sandbox = sinon.sandbox.create();
});

test.afterEach(() => {
    sandbox.restore();
});

test('can say if module absolute or not', t => {
    t.false(Project.moduleIsRelative('foo'));
    t.false(Project.moduleIsRelative('foo\\bar'));
    t.false(Project.moduleIsRelative('bar/bar/foo'));
    
    t.true(Project.moduleIsRelative('../bar'));
    t.true(Project.moduleIsRelative('.\\foo'));
    t.true(Project.moduleIsRelative('..\\bar\\foo'));
});

test('resolves relative modules correctly', t => {
    const project = new Project(new Path('c://Users/penda/projects/vue-designer'));
    const file = new Path('c://Users/penda/projects/vue-designer/foo.js');

    sandbox.stub(fs, 'existsSync').returns(true);

    const dep = project.resolveDependency(file, './bar.js');
    if (dep) {
        t.pass('dep is defined');
        t.true(dep.isEqualTo(
            new Path('c:\\Users\\penda\\projects\\vue-designer\\bar.js')));
    }
    
    const dep2 = project.resolveDependency(file, '../../foo.js');
    if (dep2) {
        t.pass('dep2 is defined');
        t.true(dep2.isEqualTo(
            new Path('c:\\Users\\penda\\foo.js')));
    }
});

test('resolves absolute modules correctly', t => {
    const project = new Project(new Path('c://Users/penda/projects/vue-designer'));
    const file = new Path('c:/Users/penda/projects/vue-designer/foo.js');

    sandbox.stub(fs, 'existsSync').returns(true);
    const readFileSync = sandbox.stub(fs, 'readFileSync');

    readFileSync.returns('{\
        "main": "main.js"\
    }');
    t.plan(4);
    const dep2 = project.resolveDependency(file, 'moment');
    if (dep2) {
        t.pass('dep2 is defined');
        t.true(dep2.isEqualTo( 
            new Path('c:/Users/penda/projects/vue-designer/node_modules/moment/main.js')));
    }

    readFileSync.returns('{\
        "main": "./dist/main.js"\
    }');
    const dep3 = project.resolveDependency(file, 'vue');
    if (dep3) {
        t.pass('dep3 is defined');
        t.true(dep3.isEqualTo(
            new Path ('c:/Users/penda/projects/vue-designer/node_modules/vue/dist/main.js')));
    }
});

test('should return undefined if a node module doesnt exist', t => {
    const project = new Project(new Path('c://Users/penda/projects/vue-designer'));
    const file = new Path('c:/Users/penda/projects/vue-designer/foo.js');

    sandbox.stub(fs, 'existsSync').returns(false);
    
    const readFileSync = sandbox.stub(fs, 'readFileSync');

    const dep2 = project.resolveDependency(file, 'moment');
    t.is(dep2, undefined);
});

test('gets the right path for node modules', t => {
    const project = new Project(new Path('c:/Users/foo'));
    t.true(project.nodeModulesPath.isEqualTo(new Path('c:/Users/foo/node_modules')));
});