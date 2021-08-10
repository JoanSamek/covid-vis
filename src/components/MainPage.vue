<template>
    <div>{{test}}</div>

</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'MainPage',
        data(){
            return{}
        },
        computed: {
            ...mapState({
                test: state => state.test.test
            })
        },
        methods: {
            ...mapActions('test', ['getTest'])
        },
        created(){
            this.getTest()
        }
    }
</script>

<style>

</style>