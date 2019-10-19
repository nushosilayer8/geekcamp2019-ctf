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
<span class="line"><span class="comment">//address: 0x0000555555555555</span></span>
<span class="line"><span class="type">void</span> <span class="func">dangerous_func</span>() {</span>
<span class="line">    <span class="func">system</span>(<span class="global">"cat flag"</span>)</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line"><span class="type">int</span> <span class="func">main</span>() {</span>
<span class="line">    <span class="type">char</span> <span class="var">buffer</span>[<span class="const">0x10</span>];</span>
<span class="line"></span>
<span class="line">    <span class="func">read</span>(<span class="const">0</span>, <span class="var">buffer</span>, <span class="const">0x100</span>);</span>
<span class="line">    <span class="kw">return</span> <span class="const">0</span>;</span>
<span class="line">}</span>
            </pre></code></v-card>
            </v-flex>
            <v-flex xs12>
            <v-card id="typer-bof1">
                <v-alert type="info">Type \x55 in the box to type the byte with value 0x55! e.g. <code>\x56\x34 => 0x3456</code></v-alert>
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
            this.msg = "FLAG: miniCTF{weeee_ez_pz123}";
        }
    },
  data: () => ({
      gotmsg: false,
      msg: '',
      wincondition: {
          name: 'return address',
          value: '0x0000555555555555'
      },
      vardecl: [
          {
              type: 'char',
              arrsize: 0x10,
              name: 'buffer',
          },
          {
              type: 'longptr',
              name: 'saved_ebp',
              value: '\x40\x34\x50\xff\xff\x7f\x00\x00',
          },
          {
              type: 'longptr',
              name: 'return address',
              value: '\xff\xff\x52\x53\x55\x55\x00\x00',
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
