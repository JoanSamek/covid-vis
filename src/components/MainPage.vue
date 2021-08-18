<template>
    <div>
        <b-tabs content-class='mt-3' v-model='tabIndex' justified>
            <b-tab title='World' :title-link-class='linkClass(0)'>
                <World :worldCases='worldCases' @country-details='getCountryDetails' />
            </b-tab>
            <b-tab title='Country' :title-link-class='linkClass(1)'>
                <v-select :options='worldCases' label='country' v-model='chosenCountry' style='width:80%; margin: auto;'></v-select>
                <br>
                <Country v-if='chosenCountry' :chosenCountry='chosenCountry' />
            </b-tab>
            <b-tab title='Correlation' :title-link-class='linkClass(2)'>
                <Correlation :worldIndicators='worldIndicators' />
                <br>
                <h4 style='width:1100px; margin:auto;text-align: justify;'>Strona w trakcie rozbudowy: zakładka pozwalajaca na wybranie czynnika (PKB, gini, populacja, gęstość zaludnienia, etc.) 
                    i generująca wykresy porównawcze (przykładowo punktowe); możliwość generacji linii trendu oraz wyliczenie jej wzoru; 
                    obliczenie współczynnika korelacji oraz r kwadrat; inne statystyki; tabela z dostepnymi danymi do pobrania.
                </h4>
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
    import Correlation from './tabs/Correlation'

    export default {
        name: 'MainPage',
        data(){
            return{
                tabIndex: 0, //chosen tab
                //WORLD TAB
                worldCases:[], //api response for world
                //COUNTRY TAB
                chosenCountry: '',
                //CORRELATION TAB
                worldIndicators: [],
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
            //get world cases data
            axios
                .get('https://corona.lmao.ninja/v2/countries?yesterday')
                .then(response => {this.worldCases = response.data})
            
            //get world countries data
            axios
                .get('http://restcountries.eu/rest/v2/all?fields=name;alpha2Code;population;area;gini')
                .then(response => {
                    console.log(JSON.stringify(response))
                })
                .catch(err => {
                    this.error = 'Data error'
                    console.log(err); 
                })
        },
        components:{
            World,
            Country,
            Correlation
        }
    }
</script>

<style>
    .under{
        text-decoration: underline;
        font-weight: bold;
    }

</style>