<template>
    <div>
        <b-container style='width:100%; max-width: 100%;' v-if='error' class="text-center">
                {{error}}
        </b-container>
        <b-container style='width:70%' v-else>
            <b-row>
                <b-col cols=6>
                    Covid-19 indicator
                    <b-form-select v-model="covidIndicator" :options="covidOptions" size="sm" class="mb-3"></b-form-select>
                </b-col>
                <b-col cols=6 >
                    Country indicator
                    <b-form-select v-model="countryIndicator" :options="countryOptions" size="sm" class="mb-3"></b-form-select>
                </b-col>
            </b-row>
        </b-container>
        <b-container style='width:100%' v-if='!error'>
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
                covidOptions: null,
                countryOptions: null,
                covidIndicator: null,
                countryIndicator: null,
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
            this.covidOptions = [
                { value: null, text: 'Please select an option' },
                {value: 'cases', text: 'Cases'},
                {value: 'casesPerOneMillion', text: 'Cases per million'},
                {value: 'deaths', text: 'Deaths'},
                {value: 'deathsPerOneMillion', text: 'Deaths per million'},
                {value: 'tests', text: 'Tests'},
                {value: 'testsPerOneMillion', text: 'Tests per million'},
                {value: 'recovered', text: 'Recovered'},
                {value: 'active', text: 'Active'},
                {value: 'critical', text: 'Critical'},
            ]
            this.countryOptions = [
                { value: null, text: 'Please select an option' },
                {value: 'population', text: 'Population'},
                {value: 'density', text: 'Population density'},
                {value: 'gini', text: 'Gini coefficient'},
                {value: 'gdp', text: 'Gross domestic product (GDP)'},
            ]
        },
        components:{
        }
    }
</script>

<style>
</style>