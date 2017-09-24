<template>
    <div class="hello">
        <h5>Create or open an existing project to start designing</h5>
        <q-icon name='alarm'></q-icon>
        <ul>
            <q-btn>Open a project</q-btn>
            <q-btn>create a project</q-btn>
        </ul>
    </div>
</template>

<script lang='ts'>

import Vue from 'vue';
import Component from 'vue-class-component';
import { QBtn } from 'quasar';

@Component({
    components: {
        QBtn
    }
})
export default class Hello extends Vue {
    name: string = 'hello';
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
