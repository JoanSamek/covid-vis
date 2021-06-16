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
                <b-container v-if='chosenCountry'>
                    <b-row>
                        <b-col>
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
                                        </b-col>
                                    </b-row>
                                </b-container>
                            </b-jumbotron>
                        </b-col>
                        <b-col v-if='countryChartData'>
                            <!-- <line-chart :data='countryChartData' xkey='date' ykeys='["cases","deaths","recovered"]'
                                line-colors='["#17a2b8","#dc3545","#ffc107"]' grid='true' grid-text-weight='bold' resize='true'
                            ></line-chart> -->
                            <!-- <line-chart :chartData='countryChartData'></line-chart> -->
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
            <b-tab title='Correlation' :title-link-class='linkClass(2)'>{{linkClass(2)}}</b-tab>
            <b-tab title='Raport' title-link-class='text-info'>{{linkClass(3)}}</b-tab>
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
    // import LineChart from './LineChart.vue'

    export default {
        name: 'MainPage',
        data(){
            return{
                tabIndex: 0,
                worldCases:[],
                worldTable:[],
                mapVariant: 'cases',
                chosenCountry: '',
                countryChartData: []
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
                let temp = {}
                let link ='https://corona.lmao.ninja/v2/historical/'
                link+=this.chosenCountry.country+'?lastdays=all'
                axios
                    .get(link)
                    .then(response => {
                        let countryCases = response.data.timeline
                        console.log(JSON.stringify(countryCases))
                        //morris
                        // Object.keys(countryCases.cases).forEach(date =>{
                        //     temp.push({
                        //         "date": date,
                        //         "cases": countryCases.cases[date],
                        //         "deaths": countryCases.deaths[date],
                        //         "recovered": countryCases.recovered[date]
                        //     })
                        // })
                        // vue chart js
                        // temp = {"labels": Object.keys(countryCases.cases), "datasets":[
                        //     {label:'cases', backgroundColor: "#17a2b8", data: []},
                        //     {label:'deaths', backgroundColor: "#dc3545", data: []},
                        //     {label:'recovered', backgroundColor: "#ffc107", data: []}
                        // ]}
                        // Object.keys(countryCases.cases).forEach(date =>{
                        //     temp.datasets[0].data.push(countryCases.cases[date])
                        //     temp.datasets[1].data.push(countryCases.deaths[date])
                        //     temp.datasets[2].data.push(countryCases.recovered[date])
                        // })
                        
                    })
                    .catch(err => alert(err))
                this.countryChartData = temp
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

            const tableCols = ['country','cases','todayCases','casesPerOneMillion','deaths','todayDeaths','deathsPerOneMillion','tests','testsPerOneMillion','recovered','active','critical']
            tableCols.forEach(column => {
                this.worldTable.push({'key': column, 'sortable': true})
            })
        },
        components:{
            MapChart,
            // LineChart
        }
    }
</script>

<style>
    .under{
        text-decoration: underline;
        font-weight: bold;
    }

</style>