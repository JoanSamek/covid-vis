<template>
    <div>
        <b-container>
            <b-row class='text-center'>
                <b-col cols=11>
                    <b-icon icon='journal-plus' v-b-tooltip.hover title='add to raport' style='color:white; cursor:pointer; position: absolute; top: 0px; right: 20px; z-index: 1000;' class='h1 border rounded p-1 bg-warning' @click='addToReport("map")'></b-icon>
                    <MapChart v-if='worldMap'
                        :countryData='worldMap'  
                        highColor="#ff0000"
                        lowColor="#17a2b8"
                        countryStrokeColor="#909090"
                        defaultCountryFillColor="#dadada" 
                        @clickCountry='countryClicked'
                        id='worldMap'
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
                </b-col>
            </b-row>
        </b-container><br>
        <b-container style='width:100%; max-width: 100%; '>
            <b-col cols=12>
                <!-- <b-icon icon='file-earmark-spreadsheet-fill' v-b-tooltip.hover title='get csv' variant='warning' style='cursor:pointer; position: absolute; top: -40px; right: 50px;' class='h2' ></b-icon> -->
                <b-icon icon='journal-plus' v-b-tooltip.hover title='add to raport' style='color:white; cursor:pointer; position: absolute; top: -44px; right: 0px; ' class='h1 border rounded p-1 bg-warning' @click='addToReport("table")'></b-icon>
                <b-table striped :items='worldCases' :fields='worldTable'></b-table>
            </b-col>
        </b-container>
    </div>
</template>

<script>
    import MapChart from 'vue-map-chart'
    import { toJpeg } from 'html-to-image';
    import { Paragraph, Table, TableCell, TableRow, WidthType, TextRun, AlignmentType } from 'docx';

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
            convertCamel(txt){
                let result = txt.replace(/([A-Z])/g, " $1");
                return result.charAt(0).toUpperCase() + result.slice(1);
            },
            valueConvert(val, prec=2) {
                let result = Number(val).toFixed(prec).toString().split('.')
                result[0] = result[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
                return result.join('.')
            },
            addToReport(item){
                let self = this,
                    newElement = {},
                    rows = [],
                    title

                const getDocRow = (values, format = {}) => {
                    let row = []
                    values.forEach(val => {
                        row.push(new TableCell({
                            children: [
                                new Paragraph({
                                children: [new TextRun({ text: val, bold: format.bold }),], 
                                alignment: AlignmentType.CENTER
                                })
                            ]
                        }))
                    })
                    return row
                }
                console.log(item)
                switch(item){
                    case 'map':
                        title = 'COVID-19: World '+ self.convertCamel(self.worldVariant) + ' map', 
                        toJpeg(document.getElementById('worldMap'), { quality: 1 })
                            .then(function (dataUrl) {
                                console.log(dataUrl)
                                newElement = {
                                    'title': title, 
                                    'data': dataUrl, 
                                    'type': 'img',
                                    'width': document.getElementById('worldMap').offsetWidth,
                                    'height': document.getElementById('worldMap').offsetHeight,
                                }
                                self.$emit("newReportElement", newElement);
                            });
                        break;
                    case 'table':
                        title = 'COVID-19: World table', 

                        rows.push( new TableRow({
                            children: getDocRow(self.worldTable.map(item=>{ return self.convertCamel(item.key) }), {bold: true}),
                            tableHeader: true
                        }))

                        self.worldCases.forEach((element)=>{
                            rows.push( new TableRow({
                            children: getDocRow(
                                self.worldTable.map(item=>{ return self.valueConvert(element[item], 0) })
                            )
                            }))
                        })

                        newElement = {
                            'title': title, 
                            'data': new Table({
                                rows: rows,
                                width: { size: 100, type: WidthType.PERCENTAGE }
                            }),
                            'type': 'table', 
                        }
                        self.$emit("newReportElement", newElement);
                        break;
                }
            }
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