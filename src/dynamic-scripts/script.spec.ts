import * as sinon from 'sinon';
import * as ts from 'typescript';
import * as fs from 'fs';
import test from 'ava';
import Asset from './asset';

import Script from './script';
import Project from './project';
import Path from './path';

let sandbox: sinon.SinonSandbox;

test.before(t => {
    sandbox = sinon.sandbox.create();
});

test.after(t => {
    sandbox.restore();
});

test('foo', t => {
    t.plan(3);
    const sampleFile = '\
        import foo from "foo";\
        import j from "./j";\
        import a from "../a";\
        \
        function foobar () {};\
    ';

    class TestScript extends Script {
        readFile () {
            t.pass('readFile is called.');
            this.fileContent = sampleFile;
        }
        scanDependencyPaths (): string[] {
            const res = super.scanDependencyPaths();
            t.deepEqual(res, ['foo', './j', '../a']);
            return res;
        }
    }
    
    const resolvePathToDependency = sandbox
        .stub(Project.prototype, 'resolveDependency')
        .returnsArg(1);

    sandbox.stub(ts, 'transpileModule').returns('');

    sandbox.stub(fs, 'readFileSync').returns(sampleFile);


    const project = new Project(new Path('/'));
    const script = new TestScript(new Path('/'), project);

    script.transpile();
    t.is(resolvePathToDependency.callCount, 3);
});