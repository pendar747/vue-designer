import test from 'ava';
import TranspiledAsset from './transpiled-asset';
import Path from './path';
import Project from './project';
import * as sinon from 'sinon';
import * as fs from 'fs';

test('given a path finds its corresponding dependency in the dependency tree', t => {
    t.plan(3);
    
    class Jay extends TranspiledAsset {
        transpile () {}
        createDependencies () {}
        readFile () {}
    }
    
    class Bar extends TranspiledAsset {
        constructor (path, pr) {
            super(path, pr);
            this._dependencies.push(new Jay(new Path('c:/bar/jo.js'), pr));
        }
        transpile () {}
        createDependencies () {}
        readFile () {}
    }

    class Foo extends TranspiledAsset {
        constructor (path, project) {
            super(path, project);
            this._dependencies.push(new Bar(new Path('c:/bar/foo.js'), project));
        }
        transpile () {}
        createDependencies () {}
        readFile () {}
    }

    const foo = new Foo(new Path('c:/o.js'), new Project(new Path('c:/foo')));
    const dep = foo.findDependency(new Path('c:/bar/jo.js'));
    t.truthy(dep, 'dep should be found');
    if (dep) {
        t.true(dep.path.isEqualTo(new Path('c:/bar/jo.js')));
        t.false(dep.path.isEqualTo(new Path('c:/bar')));
    }

});
