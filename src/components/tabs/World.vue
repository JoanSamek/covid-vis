<template>
    <div>
        <b-container>
            <b-row class='text-center'>
                <b-col cols=11>
                    <MapChart v-if='worldMap'
                        :countryData='worldMap'  
                        highColor="#ff0000"
                        lowColor="#17a2b8"
                        countryStrokeColor="#909090"
                        defaultCountryFillColor="#dadada" 
                        @clickCountry='countryClicked'
                        />
                </b-col>
                <b-col cols=1>
                    <b-button-group vertical>
                        <b-dropdown right text='Cases' :variant='getFilterBtnVariant("cases")'>
                            <b-dropdown-item @click='worldVariant="cases"'>all</b-dropdown-item>
                            <b-dropdown-item @click='worldVariant="todayCases"'>today</b-dropdown-item>
                            <b-dropdown-item @click='worldVariant="casesPerOneMillion"'>per mln</b-dropdown-item>
                        </b-dropdown>
                        <b-dropdown right text='Deaths' :variant='getFilterBtnVariant("deaths")'>
                            <b-dropdown-item @click='worldVariant="deaths"'>all</b-dropdown-item>
                            <b-dropdown-item @click='worldVariant="todayDeaths"'>today</b-dropdown-item>
                            <b-dropdown-item @click='worldVariant="deathsPerOneMillion"'>per mln</b-dropdown-item>
                        </b-dropdown>
                        <b-dropdown right text='Tests' :variant='getFilterBtnVariant("tests")'>
                            <b-dropdown-item @click='worldVariant="tests"'>all</b-dropdown-item>
                            <b-dropdown-item @click='worldVariant="testsPerOneMillion"'>per mln</b-dropdown-item>
                        </b-dropdown>
                        <b-button :variant='getFilterBtnVariant("recovered")' @click='worldVariant="recovered"'>Recovered</b-button>
                        <b-button :variant='getFilterBtnVariant("active")' @click='worldVariant="active"'>Active</b-button>
                        <b-button :variant='getFilterBtnVariant("critical")' @click='worldVariant="critical"'>Critical</b-button>
                    </b-button-group><br><br>
                    <b-icon icon='journal-plus' v-b-tooltip.hover title='add to raport' style='color:white; cursor:pointer;' class='h1 border rounded p-1 bg-warning'></b-icon>
                </b-col>
            </b-row>
        </b-container><br>
        <div>
            <b-icon icon='file-earmark-spreadsheet-fill' v-b-tooltip.hover title='get csv' variant='warning' style='cursor:pointer; float:right;' class='h2'></b-icon>
            <b-table striped :items='worldCases' :fields='worldTable'></b-table>
        </div>
    </div>
</template>

<script>
    import MapChart from 'vue-map-chart'

    export default {
        name: 'World',
        props: ['worldCases'],
        data(){
            return{
                //WORLD TAB
                worldTable: [],
                worldVariant: 'cases',
            }
        },
        computed: {
            worldMap(){
                let data = {}
                this.worldCases.forEach(country => {
                    data[country.countryInfo.iso2] = country[this.worldVariant]
                });
                return data=={}?0:data
            },
        },
        watch:{
            
        },
        methods: {
            getFilterBtnVariant(name){
                if(this.worldVariant.toLowerCase().includes(name)) return 'warning'
                return 'info'
            },
            countryClicked(country){
                let countryDetails = this.worldCases.find(element => element.countryInfo.iso2 == country.code)
                // this.$parent.tabIndex = 1 
                this.$emit('country-details', countryDetails)
            },
        },
        created(){
            window.scrollTo(0,0)
            let tableCols = ['country','cases','todayCases','casesPerOneMillion','deaths','todayDeaths','deathsPerOneMillion','tests','testsPerOneMillion','recovered','active','critical']
            tableCols.forEach(column => {
                this.worldTable.push({'key': column, 'sortable': true})
            })
        },
        components:{
            MapChart,
        }
    }
</script>

<style>

</style>