<template>
    <div>
        <b-container style='width:100%; max-width: 100%;' v-if='error' class="text-center">
                {{error}}
        </b-container>
        <b-container style='width:100%; max-width: 100%;' v-else>
            <b-row>
                <b-col cols=5>
                    <b-jumbotron bg-variant='info' text-variant='white' border-variant='dark' style='margin:auto; width: 700px; padding:2rem 1rem;'>
                        <b-container>
                            <b-row>
                                <b-col>
                                    <h2>
                                        {{chosenCountry.country}} - {{chosenCountry.countryInfo.iso2}}
                                    </h2>
                                    <b-img thumbnail :src='chosenCountry.countryInfo.flag' alt='country flag'></b-img>
                                    <p>Population: {{chosenCountry.population}}</p>
                                </b-col>
                                <b-col>
                                <hr class='my-4'>
                                    <p style='text-align:left'>
                                        All cases: {{chosenCountry.cases}} ({{chosenCountry.casesPerOneMillion}} per million)<br>
                                        All deaths: {{chosenCountry.deaths}} ({{chosenCountry.deathsPerOneMillion}} per million)<br>
                                        Recovered: {{chosenCountry.recovered}} ({{chosenCountry.recoveredPerOneMillion}} per million)<br>
                                        Active: {{chosenCountry.active}} ({{chosenCountry.activePerOneMillion}} per million)<br>
                                        Critical: {{chosenCountry.critical}} ({{chosenCountry.criticalPerOneMillion}} per million)<br>
                                        Tests: {{chosenCountry.tests}} ({{chosenCountry.testsPerOneMillion}} per million)<br>
                                        Today ({{getCurrentDate()}}): {{chosenCountry.todayCases}} cases, {{chosenCountry.todayDeaths}} deaths
                                    </p>
                                    <hr class='my-4'>
                                    <b-icon icon='journal-plus' v-b-tooltip.hover title='add to raport' style='color:white; cursor:pointer; float:right;' class='h1 border rounded p-1 bg-warning'></b-icon>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-jumbotron><br><br>
                    <b-button-group>
                        <b-button :variant='getBtnVariant(true, showDaily)' @click='showDaily=true'>Daily</b-button>
                        <b-button :variant='getBtnVariant(false, showDaily)' @click='showDaily=false'>Cumulatively</b-button>
                    </b-button-group>
                    <br><br>
                    <b-button-group>
                        <b-button :variant='getBtnVariant("all", countryPeriod)' @click='countryPeriod="all"'>All</b-button>
                        <b-button :variant='getBtnVariant("30", countryPeriod)' @click='countryPeriod="30"'>Last 30 days</b-button>
                        <b-button :variant='getBtnVariant("7", countryPeriod)' @click='countryPeriod="7"'>Last 7 days</b-button>
                    </b-button-group>
                    <b-icon icon='journal-plus' v-b-tooltip.hover title='add to raport' style='color:white; cursor:pointer; float:right;' class='h1 border rounded p-1 bg-warning'></b-icon>
                </b-col>
                <b-col cols=7 >
                    <apexchart type="line" height="500" :options="chartOptions" :series="countryChartData" style='margin-left: 20px;'></apexchart>
                </b-col>
            </b-row>
        </b-container>
        <div  v-if='countryChartData&&!error'>
            <b-icon icon='file-earmark-spreadsheet-fill' v-b-tooltip.hover title='get csv' variant='warning' style='cursor:pointer; float:right;' class='h2'></b-icon>
            <b-table striped :items='countryTableData' :fields='countryTable'></b-table>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'Country',
        props: ['chosenCountry'],
        data(){
            return{
                //COUNTRY TAB
                countryTable: [],
                countryTableData:[],
                countryChartData: [],
                chartOptions: {},
                countryPeriod: 'all',
                showDaily: true,
                error: null
            }
        },
        computed: {
            
        },
        watch:{
            chosenCountry(){
                this.countryPeriod = 'all'
                this.getCountryData()
            },
            countryPeriod(current, previous){
                if(current!=previous) this.getCountryData()
            },
            showDaily(current, previous){
                if(current!=previous) this.getCountryData()
            }
        },
        methods: {
            getCurrentDate(){
                const current = new Date()
                return current.getDate()+'/'+current.getMonth()+'/'+current.getFullYear()
            },
            getBtnVariant(a,b){
                return a==b?'warning':'info'
            },
            getCountryData(){
                this.error = null
                let tempTable = [], 
                    tempChart = [
                            { name: "cases", data: [] },
                            { name: "deaths", data: [] },
                            { name: "recovered", data: [] },
                        ], 
                    options = {
                            chart: { height: 500, type: 'line', zoom: { enabled: false } },
                            colors: ['#17a2b8', '#dc3545', '#28a745'],
                            // colors: ['#2d73f5', '#ff6358', '#78d237'],
                            dataLabels: { enabled: false },
                            stroke: { curve: 'smooth', width: 1.5 },
                            grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 }, },
                            xaxis: { categories: [], tickAmount: 10, }
                        }
                let link ='https://disease.sh/v3/covid-19/historical/'
                link+=this.chosenCountry.country+'?lastdays='+this.countryPeriod
                axios
                    .get(link)
                    .then(response => {
                        let countryCases = response.data.timeline
                        let tempData = [], prev = [0,0,0]
                        Object.keys(countryCases.cases).forEach(date =>{
                            //to ignore first records with no data
                            if(countryCases.cases[date]||countryCases.deaths[date]||countryCases.recovered[date]){
                                tempData = [countryCases.cases[date], countryCases.deaths[date], countryCases.recovered[date]]
                                if(tempData[2]==0) tempData[2]=prev[2]
                                if(this.showDaily) {
                                    tempData = tempData.map(function(v,i) { return (v - prev[i]); });
                                }
                                tempTable.push({
                                    "date": date,
                                    "cases": tempData[0],
                                    "deaths": tempData[1],
                                    "recovered": tempData[2]
                                })

                                options.xaxis.categories.push(date)
                                tempChart[0].data.push(tempData[0])
                                tempChart[1].data.push(tempData[1])
                                tempChart[2].data.push(tempData[2])
                                prev = [countryCases.cases[date], countryCases.deaths[date], countryCases.recovered[date]]
                                if(prev[2]==0) prev[2]=tempData[2]
                            }
                        })
                        
                        this.chartOptions = options
                        this.countryChartData = tempChart
                        this.countryTableData = tempTable
                    })
                    .catch(err => {
                        this.error = 'Country not found or doesn\'t have any historical data'
                        console.log(err); 
                        //Country not found or doesn't have any historical data (Mont...)
                    })
            }
        },
        created(){
            window.scrollTo(0,0)
            //country table thead
            let tableCols = ['date', 'cases', 'deaths','recovered'] 
            tableCols.forEach(column => {
                this.countryTable.push({'key': column, 'sortable': true})
            })
        },
        components:{
        }
    }
</script>

<style>
</style>