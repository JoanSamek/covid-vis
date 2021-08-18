<template>
    <div>
        <b-container style='width:100%; max-width: 100%;' v-if='error' class="text-center">
                {{error}}
        </b-container>
        <b-container style='width:100%; max-width: 100%;' v-else>
            <b-row>
                <b-col cols=6>
                    
                </b-col>
                <b-col cols=6 >

                </b-col>
            </b-row>
        </b-container>
        <!-- <div  v-if='countryChartData&&!error'>
            <b-icon icon='file-earmark-spreadsheet-fill' v-b-tooltip.hover title='get csv' variant='warning' style='cursor:pointer; float:right;' class='h2'></b-icon>
            <b-table striped :items='countryTableData' :fields='countryTable'></b-table>
        </div> -->
    </div>
</template>

<script>
    export default {
        name: 'Correlation',
        props: ['worldIndicators'],
        data(){
            return{
                error: null
            }
        },
        computed: {
            
        },
        watch:{
            
        },
        methods: {
            
        },
        created(){
            window.scrollTo(0,0)
            
        },
        components:{
        }
    }
</script>

<style>
</style>