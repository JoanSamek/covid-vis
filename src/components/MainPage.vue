<template>
    <div>
        <b-tabs content-class='mt-3' v-model='tabIndex' justified>
            <b-tab title='World' :title-link-class='linkClass(0)'>
                <World :worldCases='worldCases' :worldTable='worldTable' @country-details='getCountryDetails' />
            </b-tab>
            <b-tab title='Country' :title-link-class='linkClass(1)'>
                <v-select :options='worldCases' label='country' v-model='chosenCountry' style='width:80%; margin: auto;'></v-select>
                <br>
                <Country v-if='chosenCountry' :chosenCountry='chosenCountry' :countryTable='countryTable' />
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
    import axios from 'axios'
    import World from './tabs/World'
    import Country from './tabs/Country'

    export default {
        name: 'MainPage',
        data(){
            return{
                tabIndex: 0, //chosen tab
                //WORLD TAB
                worldCases:[], //api response for world
                worldTable:[], //data for world table
                //COUNTRY TAB
                chosenCountry: '',
                countryTable: [],
                //CORRELATION TAB
                //RAPORT TAB
                raportFile:['Total cases world map', 'Spain - description card', 'Spain - last 30 days chart', 'Total tests world map']
            }
        },
        computed: {
            
        },
        watch:{
           
        },
        methods: {
            linkClass(ind){
                return this.tabIndex==ind?'text-dark under':'text-info'
            },
            getCountryDetails(country){
                this.chosenCountry=country; 
                this.tabIndex=1
                window.scrollTo(0,0)
            }
        },
        created(){
            //api query
            axios
                .get('https://corona.lmao.ninja/v2/countries?yesterday&sort')
                .then(response => {this.worldCases = response.data})
            
            //world table thead
            let tableCols = ['country','cases','todayCases','casesPerOneMillion','deaths','todayDeaths','deathsPerOneMillion','tests','testsPerOneMillion','recovered','active','critical']
            tableCols.forEach(column => {
                this.worldTable.push({'key': column, 'sortable': true})
            })
            //country table thead
            tableCols = ['date', 'cases', 'deaths','recovered'] 
            tableCols.forEach(column => {
                this.countryTable.push({'key': column, 'sortable': true})
            })
        },
        components:{
            World,
            Country
        }
    }
</script>

<style>
    .under{
        text-decoration: underline;
        font-weight: bold;
    }

</style>