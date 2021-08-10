<template>
    <div>
        <b-tabs content-class='mt-3' v-model='tabIndex' justified>
            <b-tab title='World' :title-link-class='linkClass(0)'>
                <b-container>
                    <b-row class='text-center'>
                        <b-col cols=11>
                            <MapChart v-if='worldMap'
                                :countryData='worldMap'  
                                highColor="#ff0000"
                                lowColor="#17a2b8"
                                countryStrokeColor="#909090"
                                defaultCountryFillColor="#dadada" />
                        </b-col>
                        <b-col cols=1>
                            <b-button-group vertical>
                                <b-dropdown right text='Cases' variant='warning'>
                                    <b-dropdown-item>all</b-dropdown-item>
                                    <b-dropdown-item>today</b-dropdown-item>
                                    <b-dropdown-item>per mln</b-dropdown-item>
                                </b-dropdown>
                                <b-dropdown right text='Deaths' variant='info'>
                                    <b-dropdown-item>all</b-dropdown-item>
                                    <b-dropdown-item>today</b-dropdown-item>
                                    <b-dropdown-item>per mln</b-dropdown-item>
                                </b-dropdown>
                                <b-dropdown right text='Tests' variant='info'>
                                    <b-dropdown-item>all</b-dropdown-item>
                                    <b-dropdown-item>per mln</b-dropdown-item>
                                </b-dropdown>
                                <b-button variant='info'>Recovered</b-button>
                                <b-button variant='info'>Active</b-button>
                                <b-button variant='info'>Critical</b-button>
                            </b-button-group><br><br>
                            <b-icon icon='journal-plus' v-b-tooltip.hover title='add to raport' style='color:white; cursor:pointer;' class='h1 border rounded p-1 bg-warning'></b-icon>
                        </b-col>
                    </b-row>
                </b-container><br>
                <div>
                    <b-icon icon='file-earmark-spreadsheet-fill' v-b-tooltip.hover title='get csv' variant='warning' style='cursor:pointer; float:right;' class='h2'></b-icon>
                    <b-table striped :items='worldCases' :fields='worldTable'></b-table>
                </div>
                
            </b-tab>
            <b-tab title='Country' :title-link-class='linkClass(1)'>
                <v-select :options='worldCases' label='country' v-model='chosenCountry' style='width:80%; margin: auto;'></v-select>
                <br>
                <b-container v-if='chosenCountry' style='width:100%; max-width: 100%;'>
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
                                <b-button variant='warning'>All</b-button>
                                <b-button variant='info'>Last 30 days</b-button>
                                <b-button variant='info'>Last 7 days</b-button>
                            </b-button-group>
                            <b-icon icon='journal-plus' v-b-tooltip.hover title='add to raport' style='color:white; cursor:pointer; float:right;' class='h1 border rounded p-1 bg-warning'></b-icon>
                        </b-col>
                        <b-col cols=7>
                            <line-chart v-if='countryChartData' :chart-data='countryChartData' :styles="{height:'600px', width:'900px'}" :options='options'></line-chart>
                            <!-- <line-chart :data='countryChartData' xkey='date' ykeys='["cases","deaths","recovered"]'
                                line-colors='["#17a2b8","#dc3545","#ffc107"]' grid='true' grid-text-weight='bold' resize='true'
                            ></line-chart> -->
                            <!-- <line-chart :data="{'2017-01-01': 3, '2017-01-02': 4}" /> -->
                        </b-col>
                    </b-row>
                </b-container>
                <div  v-if='countryChartData'>
                    <b-icon icon='file-earmark-spreadsheet-fill' v-b-tooltip.hover title='get csv' variant='warning' style='cursor:pointer; float:right;' class='h2'></b-icon>
                    <b-table striped :items='countryTableData' :fields='countryTable'></b-table>
                </div>
            </b-tab>
            <b-tab title='Correlation' :title-link-class='linkClass(2)'>
                <br>
                <h1 style='width:1100px; margin:auto;text-align: justify;'>Strona w trakcie rozbudowy: zakładka pozwalajaca na wybranie czynnika (PKB, gini, populacja, gęstość zaludnienia, etc.) 
                    i generująca wykresy porównawcze (przykładowo punktowe); możliwość generacji linii trendu oraz wyliczenie jej wzoru; 
                    obliczenie współczynnika korelacji oraz r kwadrat; inne statystyki; tabela z dostepnymi danymi do pobrania.
                </h1>
            </b-tab>
            <b-tab title='Raport' title-link-class='text-info'><br>
                <b-container>
                    <b-row>
                        <b-col>
                            <b-list-group style='width: 400px; text-align: left; margin-left:200px;'>
                                <h3> Elements of the report</h3>
                                <b-list-group-item v-for='(element, i) in raportFile' :key='i'>
                                    {{element}}
                                    <b-badge variant='danger' pill style='float: right;'>delete</b-badge>
                                </b-list-group-item>
                            </b-list-group>
                        </b-col>
                        <b-col><br>
                            <h4>Download report</h4>
                            <b-button-group>
                                <b-button variant='info'>pdf</b-button>
                                <b-button variant='info'>doc</b-button>
                                <b-button variant='info'>ppt</b-button>
                            </b-button-group>
                        </b-col>
                    </b-row>
                </b-container>
                
            </b-tab>
            <template #tabs-end>
                <li role='presentation' class='nav-item align-self-center h3'>COVID-19 Analytics</li>
            </template>
        </b-tabs>
    </div>

</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import MapChart from 'vue-map-chart'
    import axios from 'axios'
    import LineChart from './LineChart.js'

    export default {
        name: 'MainPage',
        data(){
            return{
                tabIndex: 0,
                worldCases:[],
                worldTable:[],
                mapVariant: 'cases',
                chosenCountry: '',
                countryTableData:[],
                countryTable: [],
                countryChartData: {'labels':[], "datasets":[]},
                options: {
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                    },
                    responsive: true,
                    maintainAspectRatio: false
                },
                raportFile:['Total cases world map', 'Spain - description card', 'Spain - last 30 days chart', 'Total tests world map']
            }
        },
        computed: {
            ...mapState({
                test: (state) => state.test.test
            }),
            worldMap(){
                let data = {}
                this.worldCases.forEach(country => {
                    data[country.countryInfo.iso2] = country[this.worldVariant]
                });
                return data=={}?0:data
            },
               
        },
        watch:{
            chosenCountry(){
                let temp = {'labels':[], "datasets":[]}, tempTable = []
                this.countryChartData = temp
                let link ='https://corona.lmao.ninja/v2/historical/'
                link+=this.chosenCountry.country+'?lastdays=all'
                axios
                    .get(link)
                    .then(response => {
                        let countryCases = response.data.timeline
                        console.log(JSON.stringify(countryCases))
                        Object.keys(countryCases.cases).forEach(date =>{
                            tempTable.push({
                                "date": date,
                                "cases": countryCases.cases[date],
                                "deaths": countryCases.deaths[date],
                                "recovered": countryCases.recovered[date]
                            })
                        })
                        // vue chart js
                        temp = {"labels": Object.keys(countryCases.cases), "datasets":[
                            {label:'cases', borderColor: "#17a2b8", fill: false, data: []},
                            {label:'deaths', borderColor: "#dc3545", fill: false, data: []},
                            {label:'recovered', borderColor: "#ffc107", fill: false, data: []}
                        ]}
                        Object.keys(countryCases.cases).forEach(date =>{
                            temp.datasets[0].data.push(countryCases.cases[date])
                            temp.datasets[1].data.push(countryCases.deaths[date])
                            temp.datasets[2].data.push(countryCases.recovered[date])
                        })
                        // VueChartkick
                            // temp = [
                            //     {"name": 'cases', "data": countryCases.cases },
                            //     {"name": 'deaths', "data": countryCases.deaths },
                            //     {"name": 'recovered', "data": countryCases.recovered },
                            // ]
                        this.countryChartData = temp
                        this.countryTableData = tempTable
                    })
                    .catch(err => {
                        console.log(JSON.stringify(err.response.data.message))
                        // alert(err); 
                        //Country not found or doesn't have any historical data (Mont...)
                    })

            }
        },
        methods: {
            ...mapActions('test', ['getTest']),
            linkClass(ind){
                return this.tabIndex==ind?'text-dark under':'text-info'
            },
            getCurrentDate(){
                const current = new Date()
                return current.getDate()+'/'+current.getMonth()+'/'+current.getFullYear()
            }
            
        },
        created(){
            axios
                .get('https://corona.lmao.ninja/v2/countries?yesterday&sort')
                .then(response => {this.worldCases = response.data})

            let tableCols = ['country','cases','todayCases','casesPerOneMillion','deaths','todayDeaths','deathsPerOneMillion','tests','testsPerOneMillion','recovered','active','critical']
            tableCols.forEach(column => {
                this.worldTable.push({'key': column, 'sortable': true})
            })
            tableCols = ['date', 'cases', 'deaths','recovered'] 
            tableCols.forEach(column => {
                this.countryTable.push({'key': column, 'sortable': true})
            })
        },
        components:{
            MapChart,
            LineChart
        }
    }
</script>

<style>
    .under{
        text-decoration: underline;
        font-weight: bold;
    }

</style>