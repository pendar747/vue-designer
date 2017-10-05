import Asset from '../asset/asset';
import Script from '../asset/script';
import Path from '../general/path';
import Project from '../general/project';

export default class Component extends Script {
    private style: Asset;
    private template: Asset;

    constructor (path: Path, project: Project) {
        super(path, project);
    }
}