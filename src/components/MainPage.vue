<template>
    <div>
        <b-tabs content-class='mt-3' v-model='tabIndex' justified>
            <b-tab title='World' :title-link-class='linkClass(0)'>
                <World :worldCases='worldCases' @country-details='getCountryDetails' @newReportElement="updateReport"/>
            </b-tab>
            <b-tab title='Country' :title-link-class='linkClass(1)'>
                <v-select :options='worldCases' label='country' v-model='chosenCountry' style='width:80%; margin: auto;' placeholder='Please select a country'></v-select>
                <br>
                <Country v-if='chosenCountry' :chosenCountry='chosenCountry' />
            </b-tab>
            <b-tab title='Correlation' :title-link-class='linkClass(2)'>
                <Correlation :worldIndicators='worldIndicators'  :worldCases='worldCases' :gdp='gdp' :gdpPerCapita='gdpPerCapita'/>
            </b-tab>
            <b-tab title='Report' title-link-class='text-info'><br>
               <Report :report='report' />
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
    import Report from './tabs/Report'

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
                gdp: {},
                gdpPerCapita: {},
                //RAPORT TAB
                report:[]
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
            },
            getNewestValues(data){
                let countriesDict = {}
                data.forEach(item =>{
                    if(item.value){
                        if(countriesDict[item.countryiso3code] != undefined){
                            if(countriesDict[item.countryiso3code].year<Number(item.date)){
                                countriesDict[item.countryiso3code] = {
                                    year: Number(item.date),
                                    value: item.value
                                }
                            }
                        } else {
                            countriesDict[item.countryiso3code] = {
                                year: Number(item.date),
                                value: item.value
                            }
                        }
                    }
                })
                return countriesDict
            },
            updateReport(variable) {
                console.log(variable)
                this.report.push(variable);
            },
        },
        created(){
            //get world cases data
            axios
                .get('https://disease.sh/v3/covid-19/countries')
                .then(response => {this.worldCases = response.data})
            
            //get world countries data
            axios
                .get('http://restcountries.eu/rest/v2/all?fields=name;alpha2Code;population;area;gini')
                .then(response => {
                    this.worldIndicators = response.data
                })
                .catch(err => {
                    this.error = 'Data error'
                    console.log(err); 
                })
            
            //get gdp
            axios
                .get('https://api.worldbank.org/v2/en/country/all/indicator/NY.GDP.MKTP.PP.CD?format=json&per_page=20000&source=2')
                .then(response => {
                    this.gdp = this.getNewestValues(response.data[1])
                })
                .catch(err => {
                    this.error = 'Data error'
                    console.log(err); 
                })
            axios
                .get('https://api.worldbank.org/v2/en/country/all/indicator/NY.GDP.PCAP.CD?format=json&per_page=20000&source=2')
                .then(response => {
                    this.gdpPerCapita = this.getNewestValues(response.data[1])
                })
                .catch(err => {
                    this.error = 'Data error'
                    console.log(err); 
                })
        },

        components:{
            World,
            Country,
            Correlation,
            Report
        }
    }
</script>

<style>
    .under{
        text-decoration: underline;
        font-weight: bold;
    }

</style>