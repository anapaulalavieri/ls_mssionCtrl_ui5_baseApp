sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "scm/ctc/dashboard/scmctcdashboard/model/Formatter",
    'sap/ui/core/Fragment'
], function (BaseController, History, JSONModel, Formatter,Fragment) {
    "use strict";
    return BaseController.extend("scm.ctc.dashboard.scmctcdashboard.controller.SecondLayer", {
        formatter: Formatter,
        onInit: function () {
            var oViewModel = new JSONModel({
                lineItems: [],
                lineItemsName: [],
                filterSelected: 'DTD',
                highlightEXPLINE: "",
                isTableMode: true,
                sPlantName: '',
                expLine: '',
                isExplinePresent: false,
                navContent: [],
                isSecondLayer : true,
                machineClicked : ""  
            });
            this.setModel(oViewModel, "localModel");
            this.fnTriggerIframeEvents();
            this.getRouter().getRoute("secondlayer").attachPatternMatched(this._onSecondLayerMatched, this);
        },
        _onSecondLayerMatched: function (oEvent) {
            var sPlantName = oEvent.getParameter("arguments").plantDetail.replaceAll('%20', ' ');
            this.getView().getModel("localModel").setProperty("/sPlantName", sPlantName);
             this.getView().getModel("localModel").setProperty("/expLine", "");
            this.loadinframeModel();
            var oBreadNav = [{ navName: 'Global Information', navUrl: 'firstlayer' },
            { navName: sPlantName, navUrl: '' }];
            this.getView().getModel("localModel").setProperty("/navContent", oBreadNav);
            this.getOperationalKPIData();
            this.getSecondLayerData();
            this.getSecondLayerSustainabilityData();
            this.fetchGraphData();
        },
        loadinframeModel: function () {
            var oHolder = this.getView().byId("_idIFrameSecondLayer");
            var oIframeDomRef = oHolder.getDomRef();
            var iTimeSet = new Date().getTime();
            oIframeDomRef.src = "https://dubaiexpoiframe.cfapps.eu10.hana.ondemand.com/#model-factory/" + this.getView().getModel("localModel").getProperty("/sPlantName")+"/"+iTimeSet;
        },
        
        getOperationalKPIData: function () {
            var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect = "EXPPLANADHERENCE,EXPPLANADHERENCE3DAYS,EXPPLANADHERENCEDTD,EXPPLANADHERENCEMTD,EXPPLANADHERENCEWTD,EXPPLANADHERENCEYTD,EXPPLANTAVAILABILITYRATE,EXPPLANTAVAILRATE3DAYS,EXPPLANTAVAILRATEDTD,EXPPLANTAVAILRATEMTD,EXPPLANTAVAILRATEWTD,EXPPLANTAVAILRATEYTD";
            var sPlantName = this.getView().getModel("localModel").getProperty("/sPlantName");
            //    var oSelect = "EXPLINEAVAILRATE,EXPLINEAVAILRATE3DAYS,EXPLINEAVAILRATEDTD,EXPLINEAVAILRATEMTD,EXPLINEAVAILRATEWTD,EXPLINEAVAILRATEYTD,EXPLINEMACHINEEFFECTIVENESS,EXPLINEME3DAY,EXPLINEMEDTD,EXPLINEMEMTD,EXPLINEMEWTD,EXPLINEMEYTD,EXPLINEUTILIZATIONRATE,EXPLINEUTILIZATIONRATE3DAY,EXPLINEUTILIZATIONRATEDTD,EXPLINEUTILIZATIONRATEMTD,EXPLINEUTILIZATIONRATEWTD,EXPLINEUTILIZATIONRATEYTD,EXPLINEQR3DAY,EXPLINEQRDTD,EXPLINEQRMTD,EXPLINEQRWTD,EXPLINEQRYTD,EXPLINEQUALITYRATE,EXPSINJURY,EXPPROPERTYDMG,EXPNEARMISS,EXPMINJURY"
            // var oFilter = new sap.ui.model.Filter("LOCREGION", sap.ui.model.FilterOperator.EQ, sFilter);
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, sPlantName));
            aFilter.push(new sap.ui.model.Filter("PERIODID1", sap.ui.model.FilterOperator.EQ, new Date().getFullYear()));
            // aFilter.push(new sap.ui.model.Filter("UOMTOID", sap.ui.model.FilterOperator.EQ, "EA"));

            // aFilter.push(new sap.ui.model.Filter("CUSTREGION", sap.ui.model.FilterOperator.EQ, sFilter));

            //this.getView().setBusy(true);
      //      this.showBusyIndicator();
            this.getView().getModel("oGlobalModel").setProperty("/planAdherenceBusy",true);
             this.getView().getModel("oGlobalModel").setProperty("/plantAvailabilityBusy",true);
            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                filters: aFilter,
                success: function (oData, oResponse) {
                    this.getView().getModel("oGlobalModel").setProperty("/operationKPIData", oData.results[0]);
                    //this.getView().setBusy(false);
            //        this.hideBusyIndicator();
            this.getView().getModel("oGlobalModel").setProperty("/planAdherenceBusy",false);
             this.getView().getModel("oGlobalModel").setProperty("/plantAvailabilityBusy",false);
                }.bind(this),
                error: function (oError) {
                }
            });
        },

        getSecondLayerData: function () {
            var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect = "LOCID,LOCDESCR,EXPMINJURY,EXPNEARMISS,EXPPROPERTYDMG,EXPSINJURY";
            var sPlantName = this.getView().getModel("localModel").getProperty("/sPlantName");
            //    var oSelect = "EXPLINEAVAILRATE,EXPLINEAVAILRATE3DAYS,EXPLINEAVAILRATEDTD,EXPLINEAVAILRATEMTD,EXPLINEAVAILRATEWTD,EXPLINEAVAILRATEYTD,EXPLINEMACHINEEFFECTIVENESS,EXPLINEME3DAY,EXPLINEMEDTD,EXPLINEMEMTD,EXPLINEMEWTD,EXPLINEMEYTD,EXPLINEUTILIZATIONRATE,EXPLINEUTILIZATIONRATE3DAY,EXPLINEUTILIZATIONRATEDTD,EXPLINEUTILIZATIONRATEMTD,EXPLINEUTILIZATIONRATEWTD,EXPLINEUTILIZATIONRATEYTD,EXPLINEQR3DAY,EXPLINEQRDTD,EXPLINEQRMTD,EXPLINEQRWTD,EXPLINEQRYTD,EXPLINEQUALITYRATE,EXPSINJURY,EXPPROPERTYDMG,EXPNEARMISS,EXPMINJURY"
            // var oFilter = new sap.ui.model.Filter("LOCREGION", sap.ui.model.FilterOperator.EQ, sFilter);
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, sPlantName));
            // aFilter.push(new sap.ui.model.Filter("UOMTOID", sap.ui.model.FilterOperator.EQ, "EA"));

            // aFilter.push(new sap.ui.model.Filter("CUSTREGION", sap.ui.model.FilterOperator.EQ, sFilter));

            //this.getView().setBusy(true);
       //     this.showBusyIndicator();
       this.getView().getModel("oGlobalModel").setProperty("/OHSBusy",true);
            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                filters: aFilter,
                success: function (oData, oResponse) {
                    this.getView().getModel("oGlobalModel").setProperty("/OHSKPIData", oData.results[0]);
                    //this.getView().setBusy(false);
            //        this.hideBusyIndicator();
            this.getView().getModel("oGlobalModel").setProperty("/OHSBusy",false);
                }.bind(this),
                error: function (oError) {
                }
            });
        },

        getSecondLayerSustainabilityData: function () {

            var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect = "LOCID,LOCDESCR,EXPLINE,EXPLINEAVAILRATE,EXPLINEAVAILRATE3DAYS,EXPLINEAVAILRATEDTD,EXPLINEAVAILRATEMTD,EXPLINEAVAILRATEWTD,EXPLINEAVAILRATEYTD,EXPLINEMACHINEEFFECTIVENESS,EXPLINEME3DAY,EXPLINEMEDTD,EXPLINEMEMTD,EXPLINEMEWTD,EXPLINEMEYTD,EXPLINEUTILIZATIONRATE,EXPLINEUTILIZATIONRATE3DAY,EXPLINEUTILIZATIONRATEDTD,EXPLINEUTILIZATIONRATEMTD,EXPLINEUTILIZATIONRATEWTD,EXPLINEUTILIZATIONRATEYTD,EXPLINEQR3DAY,EXPLINEQRDTD,EXPLINEQRMTD,EXPLINEQRWTD,EXPLINEQRYTD,EXPLINEQUALITYRATE";
            var sPlantName = this.getView().getModel("localModel").getProperty("/sPlantName");
            //    var oSelect = "EXPLINEAVAILRATE,EXPLINEAVAILRATE3DAYS,EXPLINEAVAILRATEDTD,EXPLINEAVAILRATEMTD,EXPLINEAVAILRATEWTD,EXPLINEAVAILRATEYTD,EXPLINEMACHINEEFFECTIVENESS,EXPLINEME3DAY,EXPLINEMEDTD,EXPLINEMEMTD,EXPLINEMEWTD,EXPLINEMEYTD,EXPLINEUTILIZATIONRATE,EXPLINEUTILIZATIONRATE3DAY,EXPLINEUTILIZATIONRATEDTD,EXPLINEUTILIZATIONRATEMTD,EXPLINEUTILIZATIONRATEWTD,EXPLINEUTILIZATIONRATEYTD,EXPLINEQR3DAY,EXPLINEQRDTD,EXPLINEQRMTD,EXPLINEQRWTD,EXPLINEQRYTD,EXPLINEQUALITYRATE,EXPSINJURY,EXPPROPERTYDMG,EXPNEARMISS,EXPMINJURY"
            // var oFilter = new sap.ui.model.Filter("LOCREGION", sap.ui.model.FilterOperator.EQ, sFilter);
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, sPlantName));
            
            // aFilter.push(new sap.ui.model.Filter("UOMTOID", sap.ui.model.FilterOperator.EQ, "EA"));

            // aFilter.push(new sap.ui.model.Filter("CUSTREGION", sap.ui.model.FilterOperator.EQ, sFilter));

            //this.getView().setBusy(true);
            this.getView().getModel("localModel").setProperty("/bBottleneckBusy",true);
             this.getView().getModel("localModel").setProperty("/bExplineBusy",true);
     //       this.showBusyIndicator();
            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                filters: aFilter,
                success: function (oData, oResponse) {
                    var aArray = [];


                    for (var i = 0; i < oData.results.length; i++) {
                        oData.results[i].dummyExpLine = oData.results[i].EXPLINE
                        if (oData.results[i].EXPLINE.indexOf("_") !== -1) {
                            oData.results[i].EXPLINE = oData.results[i].EXPLINE.split("_")[1];
                        }
                        if (oData.results[i].EXPLINE.indexOf("Inspection Line") !== -1) {
                            oData.results.splice(i, 1);
                            i--;
                            continue;
                        }

                    }
                    var oCloneOData = oData.results.slice();
                    var nonBottleNeckItems = oCloneOData.sort((firstItem, secondItem) => {
                        return parseFloat(firstItem.EXPLINEMACHINEEFFECTIVENESS * 100) - parseFloat(secondItem.EXPLINEMACHINEEFFECTIVENESS * 100);
                    });
                    this.getView().getModel("localModel").setProperty("/bottleNeckItem", nonBottleNeckItems.splice(0, 1));
                    this.getView().getModel("localModel").setProperty("/nonBottleNeckItems", nonBottleNeckItems);
                    // for(var i=0;i< nonBottleNeckItems.length; i++){
                    //     nonBottleNeckItems[i].lineEffectivesness = nonBottleNeckItems[i].EXPLINEMACHINEEFFECTIVENESS
                    //     var filter = this.getView().getModel("localModel").getProperty("/filterSelected")
                    //     if(filter === 'DTD'){
                    //         nonBottleNeckItems[i].lineEffectivesness = nonBottleNeckItems[i].EXPLINEMEDTD
                    //     }
                    //     if(filter === '3DAY'){
                    //         nonBottleNeckItems[i].lineEffectivesness = nonBottleNeckItems[i].EXPLINEME3DAY
                    //     }
                    //     if(filter === 'WTD'){
                    //        nonBottleNeckItems[i].lineEffectivesness = nonBottleNeckItems[i].EXPLINEMEWTD
                    //     }
                    //     if(filter === 'MTD'){
                    //         nonBottleNeckItems[i].lineEffectivesness = nonBottleNeckItems[i].EXPLINEMEMTD
                    //     }
                    //     if(filter === 'YTD'){
                    //         nonBottleNeckItems[i].lineEffectivesness = nonBottleNeckItems[i].EXPLINEMEYTD
                    //     }
                    // }
                    this.getView().getModel("localModel").setProperty("/lineItems", oData.results);
                   //this.getView().getModel("localModel").getProperty("/filterSelected")
                    var aTestArray = oData.results.slice();
                    var a = {
                        EXPLINE: "",
                        RESDESCR: ""
                    }
                    aTestArray.unshift(a);
                    this.getView().getModel("localModel").setProperty("/aAllLineItems", aTestArray);
                    //this.getView().setBusy(false);
                    this.getView().getModel("localModel").setProperty("/bBottleneckBusy",false);
                     this.getView().getModel("localModel").setProperty("/bExplineBusy",false);
                    
          //          this.hideBusyIndicator();
                }.bind(this),
                error: function (oError) {
                }
            });
        },
        onFilterPress: function (oEvent) {
            var sSelectedFilter = oEvent.getSource().getText();
            this.getView().getModel("localModel").setProperty("/filterSelected", sSelectedFilter);
            this.fetchGraphData();
           // this.getSecondLayerSustainabilityData()
        },
        fnTriggerIframeEvents: function (_ref) {
            window.addEventListener("message", (_ref) => {
                var data = null;
                try {
                    data = JSON.parse(_ref.data);
                    //console.log(data);
                    if (typeof data === 'object') {
                        data = null
                    }
                } catch (e) {
                    data = _ref.data;
                }
                if (data) {
                    let firstWord = data.split(" ")[0];
                    let secondWord = data.split(" ")[1];
                    if (firstWord === "WORKSHOP" && secondWord === "DETAILS") {
                        var sPlantName = this.getView().getModel("localModel").getProperty("/sPlantName");
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                         var oHolder = this.getView().byId("_idIFrameSecondLayer");
            var oIframeDomRef = oHolder.getDomRef();
            oIframeDomRef.src = "";
                        oRouter.navTo("thirdlayer", {
                            plantName: sPlantName
                        });
                    }else if (firstWord === "WAREHOUSE" && secondWord === "DETAILS"){
                        var sPlantName = this.getView().getModel("localModel").getProperty("/sPlantName");
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                         var oHolder = this.getView().byId("_idIFrameSecondLayer");
            var oIframeDomRef = oHolder.getDomRef();
            oIframeDomRef.src = "";
                        oRouter.navTo("fourthlayer", {
                            plantName: sPlantName
                        });
                    }
                }
            });
        },

        fetchGraphData: function () {
            var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect;
            var filterParameter = this.getView().getModel("localModel").getProperty("/filterSelected");
            if(filterParameter === "YTD"){
                oSelect = "EXPLINE,LOCDESCR,EXPLINEAVAILRATE,EXPLINEUTILIZATIONRATE,EXPLINEQUALITYRATE,EXPLINEMACHINEEFFECTIVENESS,PERIODID3,PERIODID3_TSTAMP"
            }
            else{
                oSelect = "PERIODID0_TSTAMP,LOCDESCR,EXPLINE,EXPLINEAVAILRATE,EXPLINEUTILIZATIONRATE,EXPLINEQUALITYRATE,EXPLINEMACHINEEFFECTIVENESS,PERIODID0";
            }
            
            var sPlantName = this.getView().getModel("localModel").getProperty("/sPlantName");
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, sPlantName));

            var toDate = new Date();
            this.getView().getModel("localModel").setProperty("/bFirstVizFrame",true);
             this.getView().getModel("localModel").setProperty("/bSecondVizFrame",true);
              this.getView().getModel("localModel").setProperty("/bThirdVizFrame",true);
            
            var formattedFromDate = new Date()
            if (filterParameter === "DTD") {
                var fromDate = formattedFromDate.setDate(toDate.getDate() - 1);
                fromDate = formattedFromDate
            }
            if (filterParameter === "3DAY") {
                var fromDate = formattedFromDate.setDate(toDate.getDate() - 2);
                fromDate = formattedFromDate
            }
            if (filterParameter === "WTD") {
                var fromDate = formattedFromDate.setDate(toDate.getDate() - toDate.getDay() + 1  );
                fromDate = formattedFromDate
            }
            if (filterParameter === "MTD") {
                var fromDate = formattedFromDate.setDate(toDate.getDate() - toDate.getDate() + 1);
                fromDate = formattedFromDate
            }
            if (filterParameter === "YTD") {
                var fromDate = formattedFromDate.setDate(toDate.getDate() - 365);
                fromDate = formattedFromDate
            }
            var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
                pattern: "yyyy-MM-ddTHH:mm:ss"
            });
            var oFromDate = oDateFormat.format(fromDate);
            var oToDate = oDateFormat.format(toDate);
            //YTD
            var dCurrentDate = new Date(new Date().setHours(0, 0, 0, 0));
            var dOldDate = new Date(new Date().setDate(new Date().getDate()-new Date().getDate()+1))
            dOldDate = new Date(new Date(dOldDate).setMonth(new Date(dOldDate).getMonth()-new Date(dOldDate).getMonth()))
            if(filterParameter === "YTD"){
                aFilter.push(new sap.ui.model.Filter("PERIODID3_TSTAMP", sap.ui.model.FilterOperator.BT, dOldDate, dCurrentDate));
            }
            else{
                aFilter.push(new sap.ui.model.Filter("PERIODID0_TSTAMP", sap.ui.model.FilterOperator.BT, oFromDate, oToDate));
            }

            

            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                filters: aFilter,
                success: (oData, oResponse) => {
                    this.getView().getModel("localModel").setProperty("/ChartData", oData.results);
                    var oGraphData = this.getView().getModel("localModel").getProperty("/ChartData");
                    var oConsolidatedGraphData = this.buildGraphData(oGraphData,filterParameter);
                    //sorting
                    if(filterParameter === "YTD"){
                        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        var sorter = (a, b) => {
                            return months.indexOf(a.sFormattedDate) - months.indexOf(b.sFormattedDate);};
                        this.getView().getModel("localModel").setProperty("/consolidatedGraphData",oConsolidatedGraphData.data.sort(sorter));
                    }
                   else{
                        this.getView().getModel("localModel").setProperty("/consolidatedGraphData",oConsolidatedGraphData.data);
                   }
                    this.getView().getModel("localModel").setProperty("/graphFieldNames",oConsolidatedGraphData.fieldName);
                    this.plotLineChart1();
                    this.plotLineChart2();
                    this.plotLineChart3();
                                    },
                error: function (oError) {
                }
            });
        },

        plotLineChart1: function () {
            var chartData = this.getView().getModel("localModel");
             var oVizFrameAR =  this.byId(sap.ui.core.Fragment.createId("_IDSLLineEffectiveTile", "SLvizFrameid"));
            
            oVizFrameAR.removeAllFeeds();
            oVizFrameAR.setVizType('line');
            oVizFrameAR.setUiConfig({
                "applicationSet": "fiori"
            });

            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "Period Name",
                    value: "{sFormattedDate}"
                }],
                measures: [{
                    name: "ML1 Available Rate",
                    value: "{ML1AvailRate}"
                }, {
                    name: "ML2 Available Rate",
                    value: "{ML2AvailRate}"
                }, {
                    name: "AL Available Rate",
                    value: "{ALAvailRate}"
                },
                {
                    name: "PL Available Rate",
                    value: "{PLAvailRate}"
                },
                ],

                data: {
                    path: "/consolidatedGraphData"
                }

            });
            oVizFrameAR.setModel(chartData);
            oVizFrameAR.setDataset(oDataset);
            var feedvalueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ['ML1 Available Rate', 'ML2 Available Rate', 'AL Available Rate', 'PL Available Rate']
            }),

                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Period Name"]
                });

            oVizFrameAR.addFeed(feedvalueAxis);
            oVizFrameAR.addFeed(feedCategoryAxis);

            oVizFrameAR.setVizProperties({
                title: {
                    visible: false
                },
                tooltip:{
                    visible : false},
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                    
                },
                plotArea: {
                    
                    colorPalette: ['#3ABEF0', '#8379F7', '#A100FF', '#F5BC51'],

                    line: {
                        isSmoothed: true
                    },
                    primaryScale: {
                        maxValue: 100,
                        minValue: 90
                    }
                },
                legend: {
                    clickable: false,
                    visible: false
                }


            });
            var scalesAR = oVizFrameAR.getVizScales()
            scalesAR[0].min = 0
            scalesAR[0].max = 100
            oVizFrameAR.setVizScales(scalesAR);
            this.getView().getModel("localModel").setProperty("/bFirstVizFrame",false);
        },
        plotLineChart2: function () {
            var chartData = this.getView().getModel("localModel");

            //var oVizFrame = this.getView().byId("vizFrameid");
            var oVizFrameUR = this.byId(sap.ui.core.Fragment.createId("_IDSLLineEffectiveTile", "SL1vizFrameid"))
            //var oVizFrameUR =  this.byId(sap.ui.core.Fragment.createId(this.getView().sId, "SL1vizFrameid"))
            oVizFrameUR.removeAllFeeds();
            oVizFrameUR.setVizType('line');
            oVizFrameUR.setUiConfig({
                "applicationSet": "fiori"
            });

            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "Period Name",
                    value: "{sFormattedDate}"
                }],
                measures: [{
                    name: "ML1 Utilization Rate",
                    value: "{ML1UtilizationRate}"
                }, {
                    name: "ML2 Utilization Rate",
                    value: "{ML2UtilizationRate}"
                }, {
                    name: "AL Utilization Rate",
                    value: "{ALUtilizationRate}"
                },
                {
                    name: "PL Utilization Rate",
                    value: "{PLUtilizationRate}"
                },
                ],

                data: {
                    path: "/consolidatedGraphData"
                }

            });
            oVizFrameUR.setModel(chartData);
            oVizFrameUR.setDataset(oDataset);
            var feedvalueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ['ML1 Utilization Rate', 'ML2 Utilization Rate', 'AL Utilization Rate', 'PL Utilization Rate']
            }),

                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Period Name"]
                });

            oVizFrameUR.addFeed(feedvalueAxis);
            oVizFrameUR.addFeed(feedCategoryAxis);

            oVizFrameUR.setVizProperties({
                title: {
                    visible: false
                },
                tooltip:{
                    visible : false},
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                    // label:{
                    //     angle : 0,
                    //    truncatedLabelRatio : 0.5
                    // }
                    
                    // label:{
                    //     formatString: labelFormat,
                    // }
                },
                plotArea: {
                   
                    colorPalette: ['#3ABEF0', '#8379F7', '#A100FF', '#F5BC51'],

                    line: {
                        isSmoothed: true
                    },
                    primaryScale: {
                        maxValue: 100,
                        minValue: 90
                    }
                },
                legend: {
                    clickable: false,
                    visible: false
                },


            });
            var scalesUR = oVizFrameUR.getVizScales()
            scalesUR[0].min = 90
            scalesUR[0].max = 100
            oVizFrameUR.setVizScales(scalesUR);
            this.getView().getModel("localModel").setProperty("/bSecondVizFrame",false);
            // var oPopOver = this.getView().byId("idPopOver");
            // oPopOver.connect(oVizFrame.getVizUid());
        },
        plotLineChart3: function () {
            var chartData = this.getView().getModel("localModel");

            //var oVizFrame = this.getView().byId("vizFrameid");
             var oVizFrame = this.byId(sap.ui.core.Fragment.createId("_IDSLLineEffectiveTile", "SL2vizFrameid"));

            //var oVizFrame =  this.byId(sap.ui.core.Fragment.createId(this.getView().sId, "SL2vizFrameid"));
           
            oVizFrame.removeAllFeeds();
            oVizFrame.setVizType('line');
            oVizFrame.setUiConfig({
                "applicationSet": "fiori"
            });

            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "Period Name",
                    value: "{sFormattedDate}"
                }],
                measures: [{
                    name: "ML1 Quality Rate",
                    value: "{ML1QualityRate}"
                }, {
                    name: "ML2 Quality Rate",
                    value: "{ML2QualityRate}"
                }, {
                    name: "AL Quality Rate",
                    value: "{ALQualityRate}"
                },
                {
                    name: "PL Quality Rate",
                    value: "{PLQualityRate}"
                },
                ],

                data: {
                    path: "/consolidatedGraphData"
                }

            });
            oVizFrame.setModel(chartData);
            oVizFrame.setDataset(oDataset);
            var feedvalueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ['ML1 Quality Rate', 'ML2 Quality Rate', 'AL Quality Rate', 'PL Quality Rate']
            }),

                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Period Name"]
                });

            oVizFrame.addFeed(feedvalueAxis);
            oVizFrame.addFeed(feedCategoryAxis);

            oVizFrame.setVizProperties({
                title: {
                    visible: false
                },
                tooltip:{
                    visible : false},
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }                    
                },
                plotArea: {

                    colorPalette: ['#3ABEF0', '#8379F7', '#A100FF', '#F5BC51'],

                    line: {
                        isSmoothed: true
                    },
                    // marker:{
                    //     visible : false
                    // } 
                    primaryScale: {
                        maxValue: 100,
                        minValue: 90
                    }
                },
                legend: {
                    clickable: false,
                    visible: false
                },

            });
            var scales = oVizFrame.getVizScales()
            scales[0].min = 90
            scales[0].max = 100
            oVizFrame.setVizScales(scales);
             this.getView().getModel("localModel").setProperty("/bThirdVizFrame",false);
            // var oPopOver = this.getView().byId("idPopOver");
            // oPopOver.connect(oVizFrame.getVizUid());
        },
        handlePopoverPress: function (oEvent) {
             
             var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect;
            var filterParameter = this.getView().getModel("localModel").getProperty("/filterSelected");
            if(filterParameter === "YTD"){
                oSelect = "EXPLINE,LOCDESCR,EXPLINEAVAILRATE,EXPLINEUTILIZATIONRATE,EXPLINEQUALITYRATE,EXPLINEMACHINEEFFECTIVENESS,PERIODID3,PERIODID3_TSTAMP"
            }
            else{
                oSelect = "PERIODID0_TSTAMP,LOCDESCR,EXPLINE,EXPLINEAVAILRATE,EXPLINEUTILIZATIONRATE,EXPLINEQUALITYRATE,EXPLINEMACHINEEFFECTIVENESS,PERIODID0";
            }
            
            var sPlantName = this.getView().getModel("localModel").getProperty("/sPlantName");
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, sPlantName));

            var sSelectedPoint = oEvent.getParameters("selectData").data[0].data["Period Name"];
             var sCompareData = this.getView().getModel("localModel").getProperty("/consolidatedGraphData")
             for(var i=0;i<sCompareData.length;i++){
                 if(sSelectedPoint === sCompareData[i].sFormattedDate){
                     if(filterParameter === "YTD"){
                        var dDate = sCompareData[i].PERIODID3
                     }
                     else{
                        var dDate = sCompareData[i].PERIODID0}
                 }
             }
            if(filterParameter === "YTD"){
                aFilter.push(new sap.ui.model.Filter("PERIODID3", sap.ui.model.FilterOperator.EQ, dDate));
            }
            else{
                aFilter.push(new sap.ui.model.Filter("PERIODID0", sap.ui.model.FilterOperator.EQ,dDate));
            }
            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                filters: aFilter,
                success: (oData, oResponse) => {
                    this.getView().getModel("localModel").setProperty("/selectedPointData", oData.results);
                    var oView = this.getView();
                var oChart =  this.byId(sap.ui.core.Fragment.createId("_IDSLLineEffectiveTile", "SLvizFrameid"));
                // create popover
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "scm.ctc.dashboard.scmctcdashboard.view.fragments.ChartPopover",
                        controller: this
                    }).then(function(oPopover) {
                        oView.addDependent(oPopover);
                        //oPopover.bindElement("/ProductCollection/0");
                        return oPopover;
                    });
                }
                this._pPopover.then(function(oPopover) {
                    oPopover.openBy(oChart);
                });
                                    },
                error: function (oError) {
                }
            });
			 
		},
        onListItemClick: function (oEvent) {
            var oSelectedMachine = oEvent.getSource().getBindingContext("localModel").getObject();
            this.getView().getModel("localModel").setProperty("/expLine", oSelectedMachine.EXPLINE);
            var sPlantName = this.getView().getModel("localModel").getProperty("/sPlantName");
            this.getView().getModel("localModel").setProperty("/highlightEXPLINE", "highlightEXPLINE");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
             var oHolder = this.getView().byId("_idIFrameSecondLayer");
            var oIframeDomRef = oHolder.getDomRef();
            oIframeDomRef.src = "";
            oRouter.navTo("thirdlayer", {
                plantName: sPlantName,
                expLine: oSelectedMachine.dummyExpLine
            });
        },
        onBreadcrumbLinkPress: function (oEvent) {
            var selectedBreadCrumb = oEvent.getSource().getBindingContext('localModel').getObject();
             var oHolder = this.getView().byId("_idIFrameSecondLayer");
            var oIframeDomRef = oHolder.getDomRef();
            oIframeDomRef.src = "";
            this.getRouter().navTo(selectedBreadCrumb.navUrl);
            

        },
        onChartModePress: function () {
            this.getView().getModel("localModel").setProperty("/isTableMode", false);
        },
        onTableModePress: function () {
            this.getView().getModel("localModel").setProperty("/isTableMode", true);
        },
    });
});