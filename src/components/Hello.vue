<template>
    <div class="hello">
        <h5>Create or open an existing project to start designing</h5>
        <ul>
            <q-btn 
                icon='folder open' 
                color='primary'
                @click='openAProject()'>Open a project</q-btn>
            <q-btn 
                icon='create new folder' 
                color='secondary'>create a project</q-btn>
        </ul>
        <h5>Preview a Vue component</h5>
            <q-btn 
                @click='openFile()'
                icon='folder open' 
                color='secondary'>Open File</q-btn>
    </div>
</template>

<script lang='ts'>

import Vue from 'vue';
import Component from 'vue-class-component';
import { QBtn } from 'quasar';
import { remote } from 'electron';
import fs from 'fs';
import { Project, Script } from "../dynamic-scripts";


@Component({
    components: {
        QBtn
    }
})
export default class Hello extends Vue {
    name: string = 'hello';
    private _project: Project;

    openAProject () {
        console.log('open a project');
        const path = remote.dialog.showOpenDialog({
            properties: [ 'openDirectory' ]
        });

        if (path) {
            this._project = new Project(path[0]);
        }
    }

    openFile() {
        const path = remote.dialog.showOpenDialog({
            properties: [ 'openFile' ],
            defaultPath: this._project.rootPath
        });
        if (!path) {
            return;
        }
        const script = new Script(path[0], this._project);
        script.transpile();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@import '~variables'

.hello
    margin-top 50px
    a
        color #35495E

ul
    list-style-type none
    padding 0

li
    display inline-block
    margin 0 10px
    
</style>
