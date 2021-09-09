<template>
    <div>
        <b-container>
            <b-row class='text-center'>
                <b-col cols=12>
                    <b-container>
                        <b-row>
                            <b-col>
                                <b-list-group style='width: 600px; text-align: left; margin-left:150px;'>
                                    <h3> Elements of the report</h3>
                                    <b-list-group-item v-for='(element, i) in report' :key='i'>
                                        {{element.title}}
                                        <b-badge variant='danger' pill style='float: right;'>delete</b-badge>
                                    </b-list-group-item>
                                </b-list-group>
                            </b-col>
                            <b-col><br>
                                <h4>Download report</h4>
                                <b-button-group>
                                    <!-- <b-button variant='info'>pdf</b-button> -->
                                    <b-button variant='info' @click='getDoc()'>doc</b-button>
                                    <!-- <b-button variant='info'>ppt</b-button> -->
                                </b-button-group>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import { Paragraph, HeadingLevel, AlignmentType, TextRun, Packer } from 'docx';
    import { saveAs } from 'file-saver';

    export default {
        name: 'Report',
        props: ['report'],
        data(){
            return{

            }
        },
        computed: {
            
        },
        watch:{
            
        },
        methods: {
            getCurrentDate(){
                const current = new Date()
                return current.getDate()+'/'+current.getMonth()+'/'+current.getFullYear()
            },
            getDoc(){
                let paragraphs = [],
                    // mainItem,
                    header = `COVID-19 report `//${this.getCurrentDate}`

                    console.log('before ne par')
                paragraphs.push(
                    new Paragraph({
                        children:[
                            new TextRun({text: header,})
                        ],
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: {after: 240,}
                    })
                )

                this.report.forEach((element) => {
                    // if(element.type=='img'){
                    //     // let width = 600,
                    //     //     height = 600*element.height/element.width, //zachowanie proporcji
                    //     //     url = element.data.split('base64,'),
                    //     //     item = Media.addImage(
                    //     //         doc,
                    //     //         Uint8Array.from(atob(url[1]), c => c.charCodeAt(0)),
                    //     //         width,
                    //     //         height,
                    //     //     );
                    //     mainItem = new Paragraph( new TextRun({ text: '', break: 1 }))
                    // }else{
                    //     mainItem = element.data
                    // }

                console.log('inside loop')
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: element.title+'\n' }),
                            ],
                            spacing: {after: 200}
                        })
                    )
                    // paragraphs.push(mainItem)
                });

                console.log('before ne doc')
                let doc = new Document({
                    sections: [{
                        children: [
                        new Paragraph({
                        children:[
                            new TextRun({text: 'help',})
                        ],
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: {after: 240,}
                    })
                        ]
                    }]
                })
                Packer.toBlob(doc).then((blob) => {
                    // saveAs from FileSaver will download the file
                    saveAs(blob, "example.docx");
                });
            }
        },
        created(){
            window.scrollTo(0,0)
        },
        components:{

        }
    }
</script>

<style>

</style>