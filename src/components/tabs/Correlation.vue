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
                    <b-icon icon='journal-plus' v-b-tooltip.hover title='add to raport' style='color:white; cursor:pointer; position:absolute; top:0px; left: 30px; z-index:1000;' class='h1 border rounded p-1 bg-warning'></b-icon>
                    <apexchart type="line" height="500" :options="chartOptions" :series="chartData"></apexchart>
                </b-col>
                <b-col cols=6 >
                    <b-card bg-variant="light" class="text-center">
                        <b-card-text>
                           <h4>Regression and correlation</h4>
                           <b-icon icon='journal-plus' v-b-tooltip.hover title='add to raport' style='color:white; cursor:pointer; position:absolute; top:8px; right: 8px;' class='h1 border rounded p-1 bg-warning'></b-icon>
                        </b-card-text>
                        <b-table stacked :items="[statistic]"></b-table>
                        <h5><i>{{comment}}</i></h5>
                    </b-card>
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
    export default {
        name: 'Correlation',
        props: ['worldIndicators', 'worldCases', 'gdp', 'gdpPerCapita'],
        data(){
            return{
                covidOptions: null,
                countryOptions: null,
                covidIndicator: null,
                countryIndicator: null,
                chartOptions: {},
                chartData: [],
                loading: false,
                error: null,
                statistic: {},
                personCorr: 0
            }
        },
        computed: {
            comment(){
                let corr = Math.abs(this.personCorr)
                let comment
                if(corr<0.2) comment = 'Weak'
                else if(corr<0.4) comment = 'Low'
                else if(corr<0.6) comment = 'Moderate'
                else if(corr<0.8) comment = 'High'
                else if(corr<0.9) comment = 'Very High'
                else comment = 'Almost full'
                
                if(this.personCorr>0) comment += ' positive'
                else comment += ' negative'

                return comment + ' correlation'
            }
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
            valueConvert(val, prec=2) {
                let result = Number(val).toFixed(prec).toString().split('.')
                result[0] = result[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')//.replace(".",",")
                return result.join('.')
            },
            getChartData(){
                let self = this
                this.loading = true
                let dataScatter = [], countryInfo = {}, countryVal = 0, dataTrend=[], countryList = []
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
                                if(this.gdp[country.countryInfo.iso3]) countryVal = this.gdp[country.countryInfo.iso3].value
                                else countryVal = null
                                break;
                            case 'gdpPerCapita':
                                if(this.gdpPerCapita[country.countryInfo.iso3]) countryVal = this.gdpPerCapita[country.countryInfo.iso3].value
                                else countryVal = null
                                break;
                        }
                        if(countryVal&&country[this.covidIndicator]){
                            dataScatter.push({
                                x: country[this.covidIndicator], y: countryVal
                            })
                            countryList.push({name:country.country, flag: country.countryInfo.flag})
                        }
                    }
                });
                dataScatter.sort((a,b) => { return a.x-b.x })

                var Statistics = require('/node_modules/statistics.js/statistics.js');
                var testVars = {
                    x: 'metric',
                    y: 'metric'
                };
                var stats = new Statistics(dataScatter, testVars);
                var regression = stats.linearRegression('x', 'y');
                const calcY = (x) => {
                    return regression.regressionFirst.beta2*x+regression.regressionFirst.beta1
                }

                dataScatter.forEach(element => {
                    dataTrend.push({
                        x: element.x,
                        y: calcY(element.x)
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

                let xtitle = this.covidOptions.find(element => element.value==this.covidIndicator)['text']
                let ytitle = this.countryOptions.find(element => element.value==this.countryIndicator)['text']
                let title = 'Correlation between number of '+xtitle.toLowerCase()+' and '+ytitle.toLowerCase()+' value'
                this.chartOptions = {
                    chart: {
                        height: 500,
                        type: 'line',
                    },
                    fill: { type:'solid' },
                    markers: { size: [6, 0] },
                    tooltip: { 
                        followCursor: true,
                        custom: function({dataPointIndex}) {
                            return '<div class="arrow_box" style="padding: 5px; text-align:left">' +
                            '<img src="'+ countryList[dataPointIndex].flag+'" width="20px" />'+
                            '<strong style="margin-left: 5px;">' + countryList[dataPointIndex].name + '</strong><br/>' +
                            '<span>'+ xtitle+': '+self.valueConvert(dataScatter[dataPointIndex].x, 0)+'</span><br>'+
                            '<span>'+ ytitle+': '+self.valueConvert(dataScatter[dataPointIndex].y)+'</span>'+
                            '</div>'
                        }
                    },
                    legend: { show: false },
                    xaxis: { type: 'numeric', tickAmount: 10, labels: {
                        formatter: function(value) {
                            return self.valueConvert(value,0)
                        }},
                        title:{
                            text: xtitle
                        },
                        tooltip:{ enabled: false }
                     },
                    yaxis: { type: 'numeric', tickAmount: 10, labels: {
                        formatter: function(value) {
                            let label = self.valueConvert(value, 0)
                            return label
                        }},
                        title:{
                            text: ytitle
                        },
                     },
                     title: {
                         text: title,
                         align: 'center'
                     }
                }
                this.getStatData(stats, regression)
                this.loading = false
            },
            getStatData(stats, regression){
                //TRENDLINE
                let a = regression.regressionFirst.beta2, b = regression.regressionFirst.beta1, equation = ''
                if(a.toFixed(2)!=0) equation += this.valueConvert(a)+'x'
                else if( Math.abs(a.toPrecision(1))>0.00001) equation += a.toPrecision(2)+'x'
                if(equation!=''){
                    if(b.toFixed(2)<0) equation += ' - '+ this.valueConvert(Math.abs(b))
                    else if(b.toFixed(2)>0) equation += ' + '+ this.valueConvert(b)
                }else{
                    equation = this.valueConvert(b)
                }
                equation = 'y = '+equation
                this.statistic['Trendline'] = equation
                //PEARSON
                this.personCorr = regression.correlationCoefficient
                this.statistic['Pearson correlation coefficient'] = this.valueConvert(regression.correlationCoefficient, 4)
                this.statistic['Coefficient of determination (R squared)'] = this.valueConvert(regression.coefficientOfDetermination,4)
                this.statistic['Covariance'] = this.valueConvert(stats.covariance('x','y').covariance,4)
                this.statistic["Spearman's rank correlation"] = this.valueConvert(stats.spearmansRho('x','y').rho,4)
                // let kT = Object.entries(stats.kendallsTau('x','y')).map(([key,item])=>{
                //     if(item){
                //         return key+': '+this.valueConvert(item['tau'+key.toUpperCase()])
                //     }
                // }).filter(val => {return val})
                // this.statistic["Kendall rank correlation"] = kT.join(', ')
                let gKG = stats.goodmanKruskalsGamma('x','y')
                this.statistic["Goodman and Kruskal's Gamma"] = this.valueConvert(gKG.gamma,4)
                // this.statistic["T statistic"] = gKG.tStatistic.toFixed(4)
            },
            // calculatePearson(data){
            //     let x = [], y = []
            //     data.forEach(pointData=>{
            //         x.push(pointData.x)
            //         y.push(pointData.y)
            //     })
            //     let promedio = (lista) => { return lista.reduce((s, a) => s + a, 0) / lista.length };
            //     let n = x.length, prom_x = promedio(x) , prom_y = promedio(y);
            //     return (x.map( (e, i) => { return {x:e, y:y[i]} }).reduce( (s, a) => s + a.x * a.y, 0) - n * prom_x * prom_y) / 
            //     ((Math.sqrt(x.reduce( (s, a) => (s + a * a) , 0) - n * prom_x * prom_x)) *
            //     (Math.sqrt(y.reduce( (s, a) => (s + a * a) , 0) - n * prom_y * prom_y)));
            // } 
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
                {value: 'gdp', text: 'GDP'},
                {value: 'gdpPerCapita', text: 'GDP per capita'},
            ]
        },
        components:{
        }
    }
</script>

<style>
</style>