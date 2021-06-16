<template>
    <div>
        <b-tabs content-class='mt-3' v-model='tabIndex'>
            <b-tab title='World' :title-link-class='linkClass(0)'>{{linkClass(0)}}</b-tab>
            <b-tab title='Country' :title-link-class='linkClass(1)'>{{linkClass(1)}}</b-tab>
            <b-tab title='Correlation' :title-link-class='linkClass(2)'>{{linkClass(2)}}</b-tab>
            <b-tab title='Raport' title-link-class='text-info'>{{linkClass(3)}}</b-tab>
        </b-tabs>
    </div>

</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'MainPage',
        data(){
            return{
                tabIndex: 0
            }
        },
        computed: {
            ...mapState({
                test: (state) => state.test.test
            })
        },
        methods: {
            ...mapActions('test', ['getTest']),
            linkClass(ind){
                return this.tabIndex==ind?'text-dark':'text-info'
            }
        },
        created(){
            // this.getTest()
        }
    }
</script>

<style>

</style>