<template>
    <div>
        <b-container style='width:100%; max-width: 100%;' v-if='error' class="text-center">
                {{error}}
        </b-container>
        <b-container md=12 v-else>
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
        <br>
        <b-container style='width:100%; max-width: 100%;' v-if='!error&&covidIndicator&&countryIndicator'>
            <b-row v-if='!loading'>
                <b-col cols=6>
                    <apexchart type="line" height="500" :options="chartOptions" :series="chartData"></apexchart>
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
    import createTrend from 'trendline';
    
    export default {
        name: 'Correlation',
        props: ['worldIndicators', 'worldCases'],
        data(){
            return{
                covidOptions: null,
                countryOptions: null,
                covidIndicator: null,
                countryIndicator: null,
                chartOptions: {},
                chartData: [],
                loading: false,
                error: null
            }
        },
        computed: {
            
        },
        watch:{
            covidIndicator(val){
                if(this.countryIndicator&&val) this.getChartData()
            },
            countryIndicator(val){
                if(this.covidIndicator&&val) this.getChartData()
            }
        },
        methods: {
            getChartData(){
                this.loading = true
                let dataScatter = [], countryInfo = {}, countryVal = 0, dataTrend=[]
                this.worldCases.forEach(country => {
                    if(country.countryInfo.iso2){
                        countryInfo = this.worldIndicators.find(element => element.alpha2Code == country.countryInfo.iso2);
                        switch(this.countryIndicator){
                            case 'population':
                            case 'gini':
                                countryVal = countryInfo[this.countryIndicator]
                                break;
                            case 'density':
                                countryVal = Number((countryInfo.population/countryInfo.area).toFixed(2))
                                break;
                            case 'gdp':
                                countryVal = 0
                                break;
                        }
                        if(countryVal&&country[this.covidIndicator]){
                            dataScatter.push({
                                x: country[this.covidIndicator], y: countryVal
                            })
                        }
                    }
                });
                dataScatter.sort((a,b) => { return a.x-b.x })
                const trend = createTrend(dataScatter, 'x', 'y');

                dataScatter.forEach(element => {
                    dataTrend.push({
                        x: element.x,
                        y: trend.calcY(element.x)
                    })
                })

                this.chartData = [
                    {
                        name: 'Points',
                        type: 'scatter',
                        data: dataScatter
                    }, {
                        name: 'Line',
                        type: 'line',
                        data: dataTrend
                    }
                ]
                this.chartOptions = {
                    chart: {
                        height: 500,
                        type: 'line',
                    },
                    fill: { type:'solid' },
                    markers: { size: [6, 0] },
                    tooltip: { shared: false, intersect: true, },
                    legend: { show: false },
                    xaxis: { type: 'numeric', tickAmount: 12, labels: {
                        formatter: function(value) {
                            return value.toFixed()
                        }
                    } },
                    yaxis: { type: 'numeric', tickAmount: 12, labels: {
                        formatter: function(value) {
                            return value.toFixed()
                        }
                    } }
                }
                this.loading = false
            }
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