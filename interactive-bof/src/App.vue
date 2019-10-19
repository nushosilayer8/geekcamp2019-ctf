<template>
  <v-app>
    <!--<v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>-->

    <v-content>
        <v-layout>
            <v-col>
            <v-flex>
            <v-card id="code-bof1"><code><pre>
<span class="line"><span class="type">int</span> <span class="func">main</span>() {</span>
<span class="line">    <span class="type">char</span> <span class="var">buffer</span>[<span class="const">0x10</span>];</span>
<span class="line">    <span class="type">char</span> <span class="var">user</span>[4];</span>
<span class="line"></span>
<span class="line">    <span class="var">user</span> = <span class="const">"babe"</span>;</span>
<span class="line">    <span class="func">read</span>(<span class="const">0</span>, <span class="var">buffer</span>, <span class="const">0x100</span>);</span>
<span class="line">    <span class="comment">// checks if user == "root"</span></span>
<span class="line">    <span class="kw">if</span> (!<span class="func">strncmp</span>(<span class="var">user</span>, <span class="const">"root"</span>, <span class="const">4</span>)) {</span>
<span class="line">        <span class="comment">// try to get this to run</span></span>
<span class="line">        <span class="func">system</span>(<span class="global">"cat flag"</span>);</span>
<span class="line">    }</span>
<span class="line">    <span class="kw">return</span> <span class="const">0</span>;</span>
<span class="line">}</span>
            </pre></code></v-card>
            </v-flex>
            <v-flex xs12>
            <v-card id="typer-bof1">
                <ReadInput :vardecl="vardecl" :wincondition="wincondition" @win="win"/>
            </v-card>
            </v-flex>
            </v-col>
        </v-layout>
        <v-snackbar v-model="gotmsg" :timeout="0">
            {{msg}}
        </v-snackbar>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import ReadInput from '@/components/ReadInput.vue';

export default Vue.extend({
  name: 'App',
  components: {
      ReadInput,
  },
    methods: {
        win() {
            console.log("asdc");
            this.gotmsg = true;
            this.msg = "FLAG: miniCTF{ez_bof_1}";
        }
    },
  data: () => ({
      gotmsg: false,
      msg: '',
      wincondition: {
          name: 'user',
          value: 'root'
      },
      vardecl: [
          {
              type: 'char',
              arrsize: 0x10,
              name: 'buffer',
          },
          {
              type: 'char',
              arrsize: 4,
              name: 'user',
              value: 'babe',
          },
      ],
  }),
});
</script>

<style lang="stylus">
#typer-bof1
    margin 8px
#code-bof1
    margin 8px
    background #1E1E1E
    code
        box-shadow unset
        -webkit-box-shadow unset;
        width 100%
        color #D4D4D4
        padding-left 1rem
        background unset

        .type
            color #569cd6
        .func
            color #ddbb88
        .kw
            color #ce9178
        .const
            color #b5cea8
        .comment
            color #6A9955
        .var
            color #9cdcfe
        .global
            color #4EC9B0
</style>
