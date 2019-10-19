<template>
    <div class="flex-d">
        <table id="vars">
            <tr>
                <td v-for="v in vardecl" :key="v.name" class="intvar">
                    <span v-if="v.type === 'int'">{{toInt(buffer, v)}}</span>
                </td>
            </tr>
            <tr>
                <td v-for="v in vardecl" :key="v.name" class="bytesvar">
                    <span v-for="b in size(v)" class="byte">{{byteAt(buffer, v, b-1) || '\xa0'}}</span>
                </td>
            </tr>
            <tr>
                <td v-for="v in vardecl" :key="v.name" class="namevar">{{v.name}}</td>
            </tr>
        </table>
        <div class="typer">
            <span>&gt;&nbsp;</span>
            <input id="typebox" autofocus v-model="buffer" spellcheck="false">
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

interface Var {
    type: 'longptr' | 'int' | 'char';
    arrsize?: number;
    name: string;
    value?: any;
    offset?: number;
}

@Component
export default class ReadInput extends Vue {
    @Prop({required: true})
    public readonly vardecl!: Var[];

    @Prop({required: true})
    public readonly wincondition!: {name: string, value: string};

    public buffer: string = '';

    @Watch('buffer')
    public onBufferChanged(newbuf: string) {
        let v = this.vardecl.find(x => x.name === this.wincondition.name);
        if(v && this.wincondition.value === this.toStr(newbuf, v)) {
            this.$emit('win', newbuf);
        }
    }


    public mounted() {
        let offset = 0;
        for (const v of this.vardecl) {
            v.offset = offset;
            offset += this.size(v);
        }
    }

    public toStr(buf: string, v: Var): string|undefined {
        if(!v.arrsize) return;
        let str = '';
        for(let i = 0; i < v.arrsize; i++) {
            str += this.byteAt(buf, v, i);
        }
        return str;
    }

    public toInt(buf: string, v: Var): number|undefined {
        let n = 0;
        for (let i = 0; i < 4; i++) {
            const b = this.byteAt(buf, v, i);
            if (!b) {
                return undefined;
            }
            n += b.charCodeAt(0) << (8 * i);
        }
        return n;
    }

    public byteAt(buf: string, v: Var, idx: number): string|undefined {
        return buf[(v.offset || 0) + idx] || (v.value && v.value[idx]);
    }

    public sizeof(v: Var): number {
        switch (v.type) {
            case 'int':
                return 4;
            case 'char':
                return 1;
            case 'longptr':
                return 8;
        }
    }
    public size(v: Var): number {
        const sz = this.sizeof(v);
        if (v.arrsize) {
            return sz * v.arrsize;
        }
        return sz;
    }
}
</script>
<style lang="stylus">
.typer
    font-size 1.5rem
    background black
    font-family monospace
    color white
    border none
    display flex
#typebox
    flex 1
#typebox:focus
    outline none

.namevar
    text-align center
    color #569cd6
.intvar
    text-align center
.bytesvar .byte:first-child
    border-left 1px solid black
.bytesvar .byte:last-child
    border-right 1px solid black
.byte
    border 2px solid gray
    border-left 1px dashed gray
    border-right unset
    font-family monospace
    padding 0px 0.125rem
#vars
    margin 1rem auto
</style>
