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

    export default {
        name: 'MainPage',
        data(){
            return{
                tabIndex: 0,
                worldCases:[],
                worldTable:[],
                mapVariant: 'cases',
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
        methods: {
            ...mapActions('test', ['getTest']),
            linkClass(ind){
                return this.tabIndex==ind?'text-dark under':'text-info'
            }
        },
        created(){
            axios
                .get('https://corona.lmao.ninja/v2/countries?yesterday&sort')
                .then(response => {this.worldCases = response.data; })

            const tableCols = ['country','cases','todayCases','casesPerOneMillion','deaths','todayDeaths','deathsPerOneMillion','tests','testsPerOneMillion','recovered','active','critical']
            tableCols.forEach(column => {
                this.worldTable.push({'key': column, 'sortable': true})
            })
        },
        components:{
            MapChart
        }
    }
</script>

<style>
    .under{
        text-decoration: underline;
        font-weight: bold;
    }

</style>