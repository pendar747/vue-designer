<template>
    <div>
        <!-- Don't drop "q-app" class -->
        <div v-html="html" :style="css">
        </div>
    </div>
</template>

<script lang='ts'>
/*
 * Root component
 */
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        html: String,
        css: String,
        js: String
    }
})
export default class App extends Vue {
    html: string = '';
    css: string = '';
    js: string = '';
}
</script>
