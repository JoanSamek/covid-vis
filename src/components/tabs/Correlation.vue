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
                    <apexchart type="line" height="500" :options="chartOptions" :series="chartData"></apexchart>
                </b-col>
                <b-col cols=6 >
                    <b-card bg-variant="light" class="text-center">
                        <b-card-text>
                           <h4>Regression and correlation</h4>
                        </b-card-text>
                        <b-table stacked :items="[statistic]"></b-table>
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
                statsNorm: {
                    "Trendline": null, 
                    "Pearson correlation coefficient": '<-1, 1>', 
                    "Coefficient of determination (R squared)": '<0, 1>', 
                    "Phi coefficient": "<0°, 90°>", 
                    "Covariance": '<-1, 1>', 
                    "Goodman and Kruskal's Gamma": '<-1, 1>', 
                    "T statistic":"-", 
                    "Spearman's rank correlation": '<-1, 1>'
                }
            }
        },
        computed: {
            
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
            getChartData(){
                this.loading = true
                let dataScatter = [], countryInfo = {}, countryVal = 0, dataTrend=[]
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
                this.chartOptions = {
                    chart: {
                        height: 500,
                        type: 'line',
                    },
                    fill: { type:'solid' },
                    markers: { size: [6, 0] },
                    tooltip: { shared: false, intersect: true, },
                    legend: { show: false },
                    xaxis: { type: 'numeric', tickAmount: 12, labels: {
                        formatter: function(value) {
                            return value.toFixed()
                        }},
                        title:{
                            text: xtitle
                        }
                     },
                    yaxis: { type: 'numeric', tickAmount: 12, labels: {
                        formatter: function(value) {
                            return value.toFixed()
                        }},
                        title:{
                            text: ytitle
                        }
                     }
                }
                this.getStatData(stats, regression)
                this.loading = false
            },
            getStatData(stats, regression){
                //TRENDLINE
                let a = regression.regressionFirst.beta2, b = regression.regressionFirst.beta1, equation = ''
                if(a.toFixed(2)!=0) equation += a.toFixed(2)+'x'
                else if( Math.abs(a.toPrecision(1))>0.00001) equation += a.toPrecision(2)+'x'
                if(equation!=''){
                    if(b.toFixed(2)<0) equation += ' - '+ Math.abs(b).toFixed(2)
                    else if(b.toFixed(2)>0) equation += ' + '+ b.toFixed(2)
                }else{
                    equation = b.toFixed(2)
                }
                equation = 'y = '+equation
                this.statistic['Trendline'] = equation
                //PEARSON
                this.statistic['Pearson correlation coefficient <-1, 1>'] = regression.correlationCoefficient.toFixed(4)
                this.statistic['Coefficient of determination (R squared) <0, 1>'] = regression.coefficientOfDetermination.toFixed(4)
                this.statistic['Phi coefficient <0°, 90°>'] = regression.phi.toFixed(4)
                this.statistic['Covariance <-1, 1>'] = stats.covariance('x','y').covariance.toFixed(4)
                let gKG = stats.goodmanKruskalsGamma('x','y')
                this.statistic["Goodman and Kruskal's Gamma <-1, 1>"] = gKG.gamma.toFixed(4)
                this.statistic["T statistic"] = gKG.tStatistic.toFixed(4)
                this.statistic["Spearman's rank correlation <-1, 1>"] = stats.spearmansRho('x','y').rho.toFixed(4)
                console.log(JSON.stringify(Object.keys(this.statistic)))
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
                {value: 'gdp', text: 'Gross domestic product (GDP)'},
                {value: 'gdpPerCapita', text: 'Gross domestic product per capita (GDP per capita)'},
            ]
        },
        components:{
        }
    }
</script>

<style>
</style>