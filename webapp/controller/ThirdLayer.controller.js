sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "scm/ctc/dashboard/scmctcdashboard/model/Formatter",
    'sap/ui/core/Fragment'
], function (BaseController, History, JSONModel, Formatter,Fragment) {
    "use strict";
    return BaseController.extend("scm.ctc.dashboard.scmctcdashboard.controller.ThirdLayer", {
        formatter: Formatter,
        onInit: function () {
            var oViewModel = new JSONModel({
                lineItems: [],
                lineItemsName:[],
                filterSelected:'DTD',
                isExplinePresent : false,
                isTableMode:true,
                expLine:'',
                highlightEXPLINE:"",
                navContent: [],
                isSecondLayer : false,
                machineClicked : "" ,
                bVisible : true,
                iInterval : 0,
                sNotMachine : "2",
                sDelDelayed : "10",
                sDownTime : "2"

            });
            this.setModel(oViewModel, "localModel");
            this.fnTriggerIframeEvents();
            this.getRouter().getRoute("thirdlayer").attachPatternMatched(this._onPatternMatched, this);
            self = this;    
// self.heartbeatTrigger = new sap.ui.core.IntervalTrigger(15000);   
// self.heartbeatTrigger.addListener(function(oEvent){
//     var a = oEvent
//     if(self.getView().getModel("localModel").getProperty("/bVisible")){
//         self.getView().getModel("localModel").setProperty("/bVisible",false);
//     } else {
//         self.getView().getModel("localModel").setProperty("/bVisible",true);
//     }
   
// });
        },

        _onPatternMatched: function (oEvent) {
            var oRouteParameter = oEvent.getParameter("arguments");
            var sPlantName = oRouteParameter.plantName.replaceAll('%20', ' ');
            this.getView().getModel("localModel").setProperty("/plantName",sPlantName );
              this.getView().getModel("localModel").setProperty("/machineClicked","");
              this.getView().getModel("localModel").setProperty("/bVisible", sPlantName === "Plant Beijing" ? false : true);
              if(sPlantName === "Plant Frankfurt") {
                this.getView().getModel("localModel").setProperty("/sNotMachine","2");
                this.getView().getModel("localModel").setProperty("/sDelDelayed","12");
                this.getView().getModel("localModel").setProperty("/sDownTime","16");
              } else {
                this.getView().getModel("localModel").setProperty("/sNotMachine","24");
                this.getView().getModel("localModel").setProperty("/sDelDelayed","10");
                this.getView().getModel("localModel").setProperty("/sDownTime","6"); 
              }
              oRouteParameter.expLine = oRouteParameter.expLine ? oRouteParameter.expLine : "";
            this.getView().getModel("localModel").setProperty("/expLine", oRouteParameter.expLine?oRouteParameter.expLine.replaceAll('%20', ' '):oRouteParameter.expLine);
            this.loadinframeModel()
             var oBreadNav = [{ navName: 'Global Information', navUrl: 'firstlayer' },
                            { navName: sPlantName, navUrl: 'secondlayer' },
                            { navName: 'Workshop', navUrl: '' }];
            this.getView().getModel("localModel").setProperty("/navContent",oBreadNav);
            this.getOperationalKPIData();
            this.getOHSKPIData();
            this._getPlantLevelData();
            this.fetchGraphData()
            // if(sPlantName === "Plant Frankfurt") {
            //     this.fetchPerformingPlant();
            // }
        },

        onPerformingItemClick : function() {
            window.open("https://sapinnovation-accenture-com.iam-pr.cfapps.eu10.hana.ondemand.com/cp.portal/site#ainequipment-display&/0D83A82A73474E0E9039CB692F81058F","_blank")
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
                    let original = data;
                    let firstWord = data.split(" ")[0];
                    //MachineDetails {"RESDESCR":"Machine 6","EXPLINE":"Machining Area 2"}
                    var oSelectedMachine = original.substr(original.indexOf(" ") + 1);
                    if (firstWord === "MachineDetails") {
                        oSelectedMachine =  JSON.parse(oSelectedMachine);
                         this.getView().getModel("localModel").setProperty("/machineClicked",oSelectedMachine.RESDESCR);                       
                        this.getView().getModel("localModel").setProperty("/expLine", oSelectedMachine.EXPLINE);
                        this.getView().getModel("localModel").setProperty("/explineSelectBox",oSelectedMachine.EXPLINE)
                        this.getView().getModel("localModel").setProperty("/highlightEXPLINE","highlightEXPLINE");
                        this.getView().getModel("localModel").setProperty("/isExplinePresent",true);
                        this._getMachineLevelData();
                        // this.fetchGraphData();
                    } else if(firstWord === "AreaDetails") {
                          oSelectedMachine =  JSON.parse(oSelectedMachine);
                         this.getView().getModel("localModel").setProperty("/machineClicked","");                       
                        this.getView().getModel("localModel").setProperty("/expLine", oSelectedMachine.EXPLINE);
                        this.getView().getModel("localModel").setProperty("/explineSelectBox",oSelectedMachine.EXPLINE)
                        this.getView().getModel("localModel").setProperty("/highlightEXPLINE","highlightEXPLINE");
                        this.getView().getModel("localModel").setProperty("/isExplinePresent",true);
                        this._getMachineLevelData();
                    }
                }
            });
        },

        loadinframeModel: function () {

            var oHolder = this.getView().byId("_idIFrameThirdLayer");
            var sExpline = this.getView().getModel("localModel").getProperty("/expLine");
            var oIframeDomRef = oHolder.getDomRef();
             var iTimeSet = new Date().getTime();
             if(sExpline !== "") {
                 oIframeDomRef.src = "https://dubaiexpoiframe.cfapps.eu10.hana.ondemand.com/#model-workshop/" + this.getView().getModel("localModel").getProperty("/plantName")+"/"+sExpline+"/"+iTimeSet;
             } else {
                 oIframeDomRef.src = "https://dubaiexpoiframe.cfapps.eu10.hana.ondemand.com/#model-workshop/" + this.getView().getModel("localModel").getProperty("/plantName")+"/"+iTimeSet;
             }
           
},

        _getPlantLevelData: function () {
            var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect = "LOCID,LOCDESCR,EXPLINE,EXPLINEAVAILRATE,EXPLINEAVAILRATE3DAYS,EXPLINEAVAILRATEDTD,EXPLINEAVAILRATEMTD,EXPLINEAVAILRATEWTD,EXPLINEAVAILRATEYTD,EXPLINEMACHINEEFFECTIVENESS,EXPLINEME3DAY,EXPLINEMEDTD,EXPLINEMEMTD,EXPLINEMEWTD,EXPLINEMEYTD,EXPLINEUTILIZATIONRATE,EXPLINEUTILIZATIONRATE3DAY,EXPLINEUTILIZATIONRATEDTD,EXPLINEUTILIZATIONRATEMTD,EXPLINEUTILIZATIONRATEWTD,EXPLINEUTILIZATIONRATEYTD,EXPLINEQR3DAY,EXPLINEQRDTD,EXPLINEQRMTD,EXPLINEQRWTD,EXPLINEQRYTD,EXPLINEQUALITYRATE";
            var aFilter = [new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, this.getView().getModel("localModel").getProperty("/plantName"))];
            this.getView().getModel("localModel").setProperty("/bBottleneckBusy",true);
             this.getView().getModel("localModel").setProperty("/bExplineBusy",true);
            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                filters: aFilter,
                success: (oData, oResponse) => {
                    var nonBottleNeckItems = [];
                    var oExpObj = [{
                          "key" : "Default",
                        "Text" : "Production Line"
                    }];
                    for(var i = 0; i < oData.results.length; i++) {
                        var oBj = {
                            "key" : oData.results[i].EXPLINE,
                        "Text" : oData.results[i].EXPLINE
                        }
                        oExpObj.push(oBj);
                    }
                    if(this.getView().getModel("localModel").getProperty("/expLine")){
                        this.getView().getModel("localModel").setProperty("/explineSelectBox",this.getView().getModel("localModel").getProperty("/expLine"))
                    }else{
                        this.getView().getModel("localModel").setProperty("/explineSelectBox", "Default");
                    }
                     this.getView().getModel("localModel").setProperty("/aEXPLINEItems", oExpObj);
                    var oCloneOData = oData.results.slice();
                    var bottleNeckData;
                    var nonBottleNeckItems = oCloneOData.sort((firstItem,secondItem)=>{
                        return parseFloat(firstItem.EXPLINEMACHINEEFFECTIVENESS*100) - parseFloat(secondItem.EXPLINEMACHINEEFFECTIVENESS*100); 
                    });
                    this.getView().getModel("localModel").setProperty("/bottleNeckItem",nonBottleNeckItems.splice(0,1));
                    this.getView().getModel("localModel").setProperty("/nonBottleNeckItems", nonBottleNeckItems);
                    var oBlankObj = oData.results.slice();
                    if(this.getView().getModel("localModel").getProperty("/expLine")){
                        this.getView().getModel("localModel").setProperty("/lineItems", oData.results);
                         this.getView().getModel("localModel").setProperty("/isExplinePresent",true);
                        this.getView().getModel("localModel").setProperty("/aAllLineItems", oBlankObj);
                       
                        this._getMachineLevelData();
                    }else{
                        oBlankObj.unshift({
                        EXPLINE : "",
                        RESDESCR : ""
                    });
                        this.getView().getModel("localModel").setProperty("/lineItems", oData.results);
                         this.getView().getModel("localModel").setProperty("/isExplinePresent",false);
                        this.getView().getModel("localModel").setProperty("/aAllLineItems", oBlankObj);
                       
                    }
                    //   var aTestArray = oData.results.slice();
                    // var a = {
                    //     EXPLINE : "",
                    //     RESDESCR : ""
                    // }
                    // aTestArray.unshift(a);
                    //  this.getView().getModel("localModel").setProperty("/aAllLineItems", aTestArray);
                     this.getView().getModel("localModel").setProperty("/bBottleneckBusy",false);
                     this.getView().getModel("localModel").setProperty("/bExplineBusy",false);
                },
                error: (oError) => {
                }
            });
        },

        fnNotificationPress : function (oEvent) {
            var oButton = oEvent.getSource(),
            oView = this.getView();

        // create popover
        if (!this._pNotifPopover) {
            this._pNotifPopover = Fragment.load({
                id: oView.getId(),
                name: "scm.ctc.dashboard.scmctcdashboard.view.fragments.NotificationPopOver",
                controller: this
            }).then(function(oPopover) {
                oView.addDependent(oPopover);
              
                return oPopover;
            });
        }
        this._pNotifPopover.then(function(oPopover) {
            oPopover.openBy(oButton);
        });
        },

        fnNotificationUrl : function() {
            this.getView().getModel("localModel").setProperty("/bVisible", false);
            window.open("https://teams.microsoft.com/l/chat/0/0?users=sap.demouser@teamsap2021.onmicrosoft.com&topicName=ConnectToBuyer&message=Hi%20Alex","_blank")   
        },

        onMachineItemClick : function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("localModel").getObject(); 
            var oBj = {RESDESCR:oContext.RESDESCR ,EXPLINE: oContext.EXPLINE};
            oBj = JSON.stringify(oBj);
            var oDomRef = this.getView().byId("_idIFrameThirdLayer").getDomRef();
            oDomRef.contentWindow.postMessage("MachineDetails "+oBj, '*');
              this.getView().getModel("localModel").setProperty("/machineClicked",oContext.RESDESCR)
        },

        fetchPerformingPlant : function () {
              var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect = "RESDESCR,LOCID,LOCDESCR,RESID,EXPAVAILRATE";
            var oLocalModel = this.getView().getModel("localModel");
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, "Plant Atlanta"));
            aFilter.push(new sap.ui.model.Filter("PERIODID1", sap.ui.model.FilterOperator.EQ, new Date().getFullYear()));
            aFilter.push(new sap.ui.model.Filter("RESID", sap.ui.model.FilterOperator.EQ, "Machine 24"));
            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                filters: aFilter,
                success: (oData, oResponse) => {
                  this.getView().getModel("localModel").setProperty("/oPerformingMachine",oData.results[0]);
                    //this.getView().setBusy(false);
             //       this.hideBusyIndicator();
                },
                error: (oError) => {
                    //this.getView().setBusy(false);
         //           this.hideBusyIndicator();
                }
            });
        },

        _getMachineLevelData: function () {
            var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect = "EXPLINE,PERIODID1,RESID,RESDESCR,LOCID,LOCDESCR,EXPMACHEFFECTIVENESSMTD,EXPMACHEFFECTIVENESSWTD,EXPMACHEFFECTIVENESSYTD,EXPMACHINEEFFECTIVENESS,EXPMACHINEEFFECTIVENESS3DAY,EXPMACHINEEFFECTIVENESSDTD,EXPUTILIZATIONRATE,EXPUTILIZATIONRATE3DAY,EXPUTILIZATIONRATEDTD,EXPUTILIZATIONRATEMTD,EXPUTILIZATIONRATEWTD,EXPUTILIZATIONRATEYTD,EXPAVAILRATE,EXPAVAILRATE3DAY,EXPAVAILRATEDTD,EXPAVAILRATEMTD,EXPAVAILRATEWTD,EXPAVAILRATEYTD,EXPQUALITYRATE,EXPQUALITYRATE3DAY,EXPQUALITYRATEDTD,EXPQUALITYRATEMTD,EXPQUALITYRATEWTD,EXPQUALITYRATEYTD";
            var oLocalModel = this.getView().getModel("localModel");
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, oLocalModel.getProperty("/plantName")));
            aFilter.push(new sap.ui.model.Filter("PERIODID1", sap.ui.model.FilterOperator.EQ, '2022'));
            aFilter.push(new sap.ui.model.Filter("EXPLINE", sap.ui.model.FilterOperator.EQ, oLocalModel.getProperty("/expLine")));
             this.getView().getModel("localModel").setProperty("/bBottleneckBusy",true);
             this.getView().getModel("localModel").setProperty("/bExplineBusy",true);
             this.getView().getModel("localModel").setProperty("/bFirstVizFrame",true);
             this.getView().getModel("localModel").setProperty("/bSecondVizFrame",true);
              this.getView().getModel("localModel").setProperty("/bThirdVizFrame",true); 
            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                filters: aFilter,
                success: (oData, oResponse) => {
                    this.getView().getModel("localModel").setProperty("/lineItems", oData.results);
                    var aTestArray = oData.results.slice();
                    var a = {
                        EXPLINE : "",
                        RESDESCR : ""
                    }
                    aTestArray.unshift(a);
                     this.getView().getModel("localModel").setProperty("/aAllLineItems", aTestArray);
                    //this.getView().setBusy(false);
                       this.getView().getModel("localModel").setProperty("/bBottleneckBusy",false);
                     this.getView().getModel("localModel").setProperty("/bExplineBusy",false);
         //           this.hideBusyIndicator();
                    this.fetchGraphData()
                },
                error: (oError) => {
                    //this.getView().setBusy(false);
         //           this.hideBusyIndicator();
                }
            });
        },

        getOperationalKPIData: function () {
            var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect = "EXPPLANADHERENCE,EXPPLANADHERENCE3DAYS,EXPPLANADHERENCEDTD,EXPPLANADHERENCEMTD,EXPPLANADHERENCEWTD,EXPPLANADHERENCEYTD,EXPPLANTAVAILABILITYRATE,EXPPLANTAVAILRATE3DAYS,EXPPLANTAVAILRATEDTD,EXPPLANTAVAILRATEMTD,EXPPLANTAVAILRATEWTD,EXPPLANTAVAILRATEYTD";
            var sPlantDetail = this.getView().getModel("localModel").getProperty("/plantName");
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, sPlantDetail));
             aFilter.push(new sap.ui.model.Filter("PERIODID1", sap.ui.model.FilterOperator.EQ, new Date().getFullYear()));
             this.getView().getModel("oGlobalModel").setProperty("/planAdherenceBusy",true)
            this.getView().getModel("oGlobalModel").setProperty("/plantAvailabilityBusy",true)
            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                filters: aFilter,
                success:  (oData, oResponse) => {
                    this.getView().getModel("oGlobalModel").setProperty("/operationKPIData",oData.results[0]);
                    this.getView().getModel("oGlobalModel").setProperty("/planAdherenceBusy",false)
                    this.getView().getModel("oGlobalModel").setProperty("/plantAvailabilityBusy",false)
                },
                error:  (oError) => {
                    this.getView().getModel("oGlobalModel").setProperty("/planAdherenceBusy",false)
                    this.getView().getModel("oGlobalModel").setProperty("/plantAvailabilityBusy",false)
                }
            });
        },

         getOHSKPIData : function () {
             var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect = "LOCID,LOCDESCR,EXPMINJURY,EXPNEARMISS,EXPPROPERTYDMG,EXPSINJURY";
            var sPlantDetail =  this.getView().getModel("localModel").getProperty("/plantName");
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, sPlantDetail));
            //this.getView().setBusy(true);
            //this.showBusyIndicator();
            this.getView().getModel("oGlobalModel").setProperty("/OHSBusy",true);
            this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                filters: aFilter,
                success: function (oData, oResponse) {
                     this.getView().getModel("oGlobalModel").setProperty("/OHSKPIData", oData.results[0]);
                    //this.getView().setBusy(false);
                    this.getView().getModel("oGlobalModel").setProperty("/OHSBusy",false);
                    //this.hideBusyIndicator();
                }.bind(this),
                error: function (oError) {
                }
            });
        },

        fetchGraphData : function (){
            var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect; 
            var filterParameter = this.getView().getModel("localModel").getProperty("/filterSelected")
             if(filterParameter === "YTD"){
                oSelect = "LOCDESCR,EXPLINE,RESDESCR,EXPAVAILRATE,EXPMACHINEEFFECTIVENESS,EXPUTILIZATIONRATE,EXPQUALITYRATE,PERIODID3,PERIODID3_TSTAMP"
            }
            else{
             oSelect = "PERIODID0_TSTAMP,LOCDESCR,EXPLINE,RESDESCR,EXPAVAILRATE,EXPMACHINEEFFECTIVENESS,EXPUTILIZATIONRATE,EXPQUALITYRATE,PERIODID0";
            }
            var sPlantDetail = this.getView().getModel("localModel").getProperty("/plantName");
            
            var expline = this.getView().getModel("localModel").getProperty("/expLine")
            if(expline){
                aFilter.push(new sap.ui.model.Filter("EXPLINE", sap.ui.model.FilterOperator.EQ, expline));
            }
            aFilter.push(new sap.ui.model.Filter("LOCDESCR", sap.ui.model.FilterOperator.EQ, sPlantDetail));
            
            var toDate = new Date();
            
            var formattedFromDate = new Date()
            if(filterParameter === "DTD"){
                var fromDate = formattedFromDate.setDate(toDate.getDate() -1);
                 fromDate = formattedFromDate
            }
            if(filterParameter === "3DAY"){
                 var fromDate = formattedFromDate.setDate(toDate.getDate() -2);
                 fromDate = formattedFromDate
            }
            if(filterParameter === "WTD"){
                 var fromDate = formattedFromDate.setDate(toDate.getDate() -toDate.getDay() +1);
                 fromDate = formattedFromDate
            }
            if(filterParameter === "MTD"){
                var fromDate = formattedFromDate.setDate(toDate.getDate() -toDate.getDate()+1 );
                 fromDate = formattedFromDate
            }
            if(filterParameter === "YTD"){
                var fromDate = formattedFromDate.setDate(toDate.getDate() -365);
                 fromDate = formattedFromDate
            }
                var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
                pattern: "yyyy-MM-ddTHH:mm:ss"
                });
                var oFromDate = oDateFormat.format(fromDate);
                var oToDate = oDateFormat.format(toDate);      
			
             this.getView().getModel("localModel").setProperty("/bFirstVizFrame",true);
             this.getView().getModel("localModel").setProperty("/bSecondVizFrame",true);
              this.getView().getModel("localModel").setProperty("/bThirdVizFrame",true); 
              //YTD
            var dCurrentDate = new Date(new Date().setHours(0, 0, 0, 0));
           var dOldDate = new Date(new Date().setDate(new Date().getDate()-new Date().getDate()+1))
            dOldDate = new Date(new Date(dOldDate).setMonth(new Date(dOldDate).getMonth()-new Date(dOldDate).getMonth()))
            if(filterParameter === "YTD"){
                aFilter.push(new sap.ui.model.Filter("PERIODID3_TSTAMP", sap.ui.model.FilterOperator.BT, dOldDate, dCurrentDate));
            }
            else{
             aFilter.push(new sap.ui.model.Filter("PERIODID0_TSTAMP", sap.ui.model.FilterOperator.BT, oFromDate, oToDate));}
             
             this.getView().getModel().read(sUrl, {
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                filters: aFilter,
                success: (oData, oResponse) => {
                    this.getView().getModel("localModel").setProperty("/ChartData", oData.results);
                    var oGraphData = this.getView().getModel("localModel").getProperty("/ChartData");
                    var oConsolidatedGraphData = {}
                    if(expline){
                        // aFilter.push(new sap.ui.model.Filter("EXPLINE", sap.ui.model.FilterOperator.EQ, expline));
                     
                         oConsolidatedGraphData =   this.buildGraphData1(filterParameter);
                    }
                    else{
                        oConsolidatedGraphData = this.buildGraphData(oGraphData,filterParameter);
                            
                    }

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
                    //this.buildGraphData1()
                    this.plotLineChart1();
                    this.plotLineChart2();
                    this.plotLineChart3();
                   
                    },
                error: function (oError) {
                }
            });
        },

        buildGraphData1 : function(filterParameter){
            var newGraphData = []
            var oGraphData = this.getView().getModel("localModel").getProperty("/ChartData");
             var graphPlotField = {availableRate: [], qualityRate : [], utilizationRate : [] };

            //var blankData = {};
            //var isNotPresent= true;
            oGraphData.forEach((eachGraphData)=>{
                var blankData = {};
                var isNotPresent= true;
               if(filterParameter === "YTD"){
                    newGraphData.forEach((eachNewData)=>{
                        if (eachNewData.PERIODID3 === eachGraphData.PERIODID3){
                            blankData = eachNewData;
                            isNotPresent = false;
                            return true
                        }
                        
                        return false

                    })
                }else{
                    newGraphData.forEach((eachNewData)=>{
                        if (eachNewData.PERIODID0 === eachGraphData.PERIODID0){
                            blankData = eachNewData;
                            isNotPresent = false;
                            return true
                        }
                        
                        return false

                    })
                }
                 if(filterParameter ==="YTD"){
                blankData.PERIODID3 = eachGraphData.PERIODID3}
                else{blankData.PERIODID0 = eachGraphData.PERIODID0}
                if(eachGraphData.RESDESCR === "Machine 1" || eachGraphData.RESDESCR === "Machine 5" || eachGraphData.RESDESCR === "Machine 9" ||
                eachGraphData.RESDESCR === "Machine 11" || eachGraphData.RESDESCR === "Machine 12" || eachGraphData.RESDESCR === "Machine 16" || eachGraphData.RESDESCR === "Machine 20" || eachGraphData.RESDESCR === "Machine 22" || eachGraphData.RESDESCR === "Machine 23" || eachGraphData.RESDESCR === "Machine 27" || eachGraphData.RESDESCR === "Machine 31" || eachGraphData.RESDESCR === "Machine 33"){
                            blankData.ML1AvailRate = ((eachGraphData.EXPAVAILRATE)*100).toFixed(0);
                            blankData.ML1QualityRate = ((eachGraphData.EXPQUALITYRATE)*100).toFixed(0);
                            blankData.ML1UtilizationRate = ((eachGraphData.EXPUTILIZATIONRATE)*100).toFixed(0); 
                               if( eachGraphData.EXPAVAILRATE){
                                graphPlotField.availableRate.indexOf("ML1AvailRate") === -1 ? graphPlotField.availableRate.push("ML1AvailRate"): "";
                            }
                            if( eachGraphData.EXPQUALITYRATE){
                                graphPlotField.qualityRate.indexOf("ML1QualityRate") === -1 ? graphPlotField.qualityRate.push("ML1QualityRate"): "";
                            }
                            if(eachGraphData.EXPUTILIZATIONRATE){
                                graphPlotField.utilizationRate.indexOf("ML1UtilizationRate") === -1 ? graphPlotField.utilizationRate.push("ML1UtilizationRate"): "";
                            }  
                }
                if(eachGraphData.RESDESCR === "Machine 2" || eachGraphData.RESDESCR === "Machine 6" || eachGraphData.RESDESCR === "Machine 17" || eachGraphData.RESDESCR === "Machine 28" || eachGraphData.RESDESCR === "Machine 13" || eachGraphData.RESDESCR === "Machine 24"){
                            blankData.ML2AvailRate = ((eachGraphData.EXPAVAILRATE)*100).toFixed(0);
                            blankData.ML2QualityRate = ((eachGraphData.EXPQUALITYRATE)*100).toFixed(0);
                            blankData.ML2UtilizationRate = ((eachGraphData.EXPUTILIZATIONRATE)*100).toFixed(0);  
                               if( eachGraphData.EXPAVAILRATE){
                                graphPlotField.availableRate.indexOf("ML2AvailRate") === -1 ? graphPlotField.availableRate.push("ML2AvailRate"): "";
                            }
                            if(eachGraphData.EXPQUALITYRATE){
                                graphPlotField.qualityRate.indexOf("ML2QualityRate") === -1 ? graphPlotField.qualityRate.push("ML2QualityRate"): "";
                            }
                            if(eachGraphData.EXPUTILIZATIONRATE){
                                graphPlotField.utilizationRate.indexOf("ML2UtilizationRate") === -1 ? graphPlotField.utilizationRate.push("ML2UtilizationRate"): "";
                            }  
                }
                if(eachGraphData.RESDESCR === "Machine 3" || eachGraphData.RESDESCR === "Machine 7" || eachGraphData.RESDESCR === "Machine 14" || eachGraphData.RESDESCR === "Machine 18" || eachGraphData.RESDESCR === "Machine 25" || eachGraphData.RESDESCR === "Machine 29"){
                            blankData.ALAvailRate = ((eachGraphData.EXPAVAILRATE)*100).toFixed(0);
                            blankData.ALQualityRate = ((eachGraphData.EXPQUALITYRATE)*100).toFixed(0);
                            blankData.ALUtilizationRate = ((eachGraphData.EXPUTILIZATIONRATE)*100).toFixed(0);   
                              if(eachGraphData.EXPAVAILRATE){
                                graphPlotField.availableRate.indexOf("ALAvailRate") === -1 ? graphPlotField.availableRate.push("ALAvailRate"): "";
                            }
                            if(eachGraphData.EXPQUALITYRATE){
                                graphPlotField.qualityRate.indexOf("ALQualityRate") === -1 ? graphPlotField.qualityRate.push("ALQualityRate"): "";
                            }
                            if(eachGraphData.EXPUTILIZATIONRATE){
                                graphPlotField.utilizationRate.indexOf("ALUtilizationRate") === -1 ? graphPlotField.utilizationRate.push("ALUtilizationRate"): "";
                            }  
                }
               
                    var sObtainedDate, oDate;
                    sObtainedDate = eachGraphData.PERIODID0
                    oDate = new Date(sObtainedDate)
                    if(filterParameter === "3DAY" || filterParameter === "DTD" || filterParameter === "WTD"){
                        blankData.sFormattedDate = oDate.toString().slice(0,3)
                    }
                    if(filterParameter === "MTD"){
                        if(oDate.toLocaleDateString("in-HI").length === 8) {
                        blankData.sFormattedDate = oDate.toLocaleDateString("in-HI").slice(0,1)}
                        if(oDate.toLocaleDateString("in-HI").length === 9) {
                        blankData.sFormattedDate = oDate.toLocaleDateString("in-HI").slice(0,2)}
                        if(oDate.toLocaleDateString("in-HI").length === 10) {
                        blankData.sFormattedDate = oDate.toLocaleDateString("in-HI").slice(0,2)}
                    }
                    if(filterParameter === "YTD"){
                    sObtainedDate = eachGraphData.PERIODID3
                        blankData.sFormattedDate = sObtainedDate.slice(3,6)
                    }
                
                if(isNotPresent){
                    newGraphData.push(blankData)
                }
                 
                 
                
            });
              return {data:newGraphData,fieldName : graphPlotField};



            // this.getView().getModel("localModel").setProperty("/consolidatedGraphData",newGraphData)
            //  this.plotLineChart1();
            //  this.plotLineChart2();
            // this.plotLineChart3()
            
        },

        plotLineChart1: function () {
            var chartData = this.getView().getModel("localModel");
            
            //var oVizFrame = this.getView().byId("vizFrameid");
            
            var oVizFrameARTL =  this.byId(sap.ui.core.Fragment.createId("_IDTLLineEffectiveTile", "TLvizFrameid"));
            oVizFrameARTL.removeAllFeeds();
            oVizFrameARTL.setVizType('line');
            oVizFrameARTL.setUiConfig({
                "applicationSet": "fiori"
            });

            var measures= [];
            var oFieldNames = chartData.getProperty("/graphFieldNames");
            // availableRate: [], qualityRate : [], utilizationRate : []
            oFieldNames.availableRate.forEach(eachName=>{
                var oNewMeasures = {
                    name : eachName,
                    value : `{${eachName}}`
                };
                measures.push(oNewMeasures)
            })
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "Period Name",
                    value: "{sFormattedDate}"
                }],
               
                measures : measures,
                data: {
                    path: "/consolidatedGraphData"
                }

            });
            oVizFrameARTL.setModel(chartData);
            oVizFrameARTL.setDataset(oDataset);
            // var chartValues = this.getView().getModel("localModel").getProperty("/lineData") 
            // var aArray = []
            // for(var i=0; i<chartValues[0].Data.length ; i++){
                 
            //     aArray.push(chartValues[0].Data[i].name);
            // }
            
            var feedvalueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': oFieldNames.availableRate
            }),

                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Period Name"]
                });

            oVizFrameARTL.addFeed(feedvalueAxis);
            oVizFrameARTL.addFeed(feedCategoryAxis);

            oVizFrameARTL.setVizProperties({
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
                    dataPointSize: {
                        min: 25,
                        max: 25
                    },
                    gap: {
                        barSpacing: 0
                    },
                    colorPalette: ['#3ABEF0', '#8379F7', '#A100FF','#F5BC51'],
                    
                    line:{
                        isSmoothed : true
                    } ,
                    primaryScale:{
                        maxValue:100,
                        minValue:90
                    }
                },
                legend: {
                    clickable: false,
                    visible: false
                }
                

            });
            var scalesAR = oVizFrameARTL.getVizScales()
            scalesAR[0].min = 0
            scalesAR[0].max = 100
            oVizFrameARTL.setVizScales(scalesAR);
             this.getView().getModel("localModel").setProperty("/bFirstVizFrame",false);
            // var oPopOver = this.getView().byId("idPopOver");
            // oPopOver.connect(oVizFrame.getVizUid());
        },
        plotLineChart2 : function () {
            var chartData = this.getView().getModel("localModel");
            
            //var oVizFrame = this.getView().byId("vizFrameid");
            var oVizFrameUR =  this.byId(sap.ui.core.Fragment.createId("_IDTLLineEffectiveTile", "TL1vizFrameid"))
            oVizFrameUR.removeAllFeeds();
            oVizFrameUR.setVizType('line');
            oVizFrameUR.setUiConfig({
                "applicationSet": "fiori"
            });
            var measures= [];
            var oFieldNames = chartData.getProperty("/graphFieldNames");
            // availableRate: [], qualityRate : [], utilizationRate : []
            oFieldNames.utilizationRate.forEach(eachName=>{
                var oNewMeasures = {
                    name : eachName,
                    value : `{${eachName}}`
                };
                measures.push(oNewMeasures)
            })
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "Period Name",
                    value: "{sFormattedDate}"
                }],
                measures: measures,

                data: {
                    path: "/consolidatedGraphData"
                }

            });
            oVizFrameUR.setModel(chartData);
            oVizFrameUR.setDataset(oDataset);
            var feedvalueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': oFieldNames.utilizationRate
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
                },
                plotArea: {
                    dataPointSize: {
                        min: 25,
                        max: 25
                    },
                    gap: {
                        barSpacing: 0
                    },
                    colorPalette: ['#3ABEF0', '#8379F7', '#A100FF','#F5BC51'],
                    
                    line:{
                        isSmoothed : true
                    } ,
                    primaryScale:{
                        maxValue:100,
                        minValue:90
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
        plotLineChart3 : function () {
            var chartData = this.getView().getModel("localModel");
            
            //var oVizFrame = this.getView().byId("vizFrameid");
            var oVizFrame =  this.byId(sap.ui.core.Fragment.createId("_IDTLLineEffectiveTile", "TL2vizFrameid"));
           
            oVizFrame.removeAllFeeds();
            oVizFrame.setVizType('line');
            oVizFrame.setUiConfig({
                "applicationSet": "fiori"
            });
            var measures= [];
            var oFieldNames = chartData.getProperty("/graphFieldNames");
            // availableRate: [], qualityRate : [], utilizationRate : []
            oFieldNames.qualityRate.forEach(eachName=>{
                var oNewMeasures = {
                    name : eachName,
                    value : `{${eachName}}`
                };
                measures.push(oNewMeasures)
            })
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "Period Name",
                    value: "{sFormattedDate}"
                }],
                measures: measures,

                data: {
                    path: "/consolidatedGraphData"
                }

            });
            oVizFrame.setModel(chartData);
            oVizFrame.setDataset(oDataset);
            var feedvalueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': oFieldNames.qualityRate
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
                    
                    colorPalette: ['#3ABEF0', '#8379F7', '#A100FF','#F5BC51'],
                    
                    line:{
                        isSmoothed : true
                    },
                    // marker:{
                    //     visible : false
                    // } 
                    primaryScale:{
                        maxValue:100,
                        minValue:90
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

        onExplineChange : function (oEvent) {
            var oSelectedMachine = oEvent.getSource().getSelectedKey();
            if(oSelectedMachine !== "") {
                 this.getView().getModel("localModel").setProperty("/expLine", oSelectedMachine);
            this.getView().getModel("localModel").setProperty("/highlightEXPLINE","highlightEXPLINE");
            this.getView().getModel("localModel").setProperty("/isExplinePresent",true);
            this._getMachineLevelData();
            //this.fetchGraphData();
            var oBjh = {EXPLINE: oSelectedMachine};
            oBjh=JSON.stringify(oBjh);
            var oDomRef = this.getView().byId("_idIFrameThirdLayer").getDomRef();
            oDomRef.contentWindow.postMessage("AreaDetails "+oBjh, '*');
            } else {
                 this.getView().getModel("localModel").setProperty("/expLine", "");
            this.getView().getModel("localModel").setProperty("/highlightEXPLINE","");
            this.getView().getModel("localModel").setProperty("/isExplinePresent",false);
              this._getPlantLevelData();
            this.fetchGraphData()
            var oBjh = {EXPLINE: ""};
            oBjh=JSON.stringify(oBjh);
            var oDomRef = this.getView().byId("_idIFrameThirdLayer").getDomRef();
        //    oDomRef.contentWindow.postMessage("MACHINE NOCLICK", '*');
            oDomRef.contentWindow.postMessage("AreaDetails "+oBjh, '*');
            }
           
        },
        handlePopoverPress: function (oEvent) {
             
             var sUrl = "/DUBAIEXPO";
            var aFilter = [];
            var oSelect;
            var filterParameter = this.getView().getModel("localModel").getProperty("/filterSelected");
            var expline = this.getView().getModel("localModel").getProperty("/expLine");
            if(expline){
               if(filterParameter === "YTD"){
                    oSelect = "LOCDESCR,EXPLINE,RESDESCR,EXPAVAILRATE,EXPMACHINEEFFECTIVENESS,EXPUTILIZATIONRATE,EXPQUALITYRATE,PERIODID3,PERIODID3_TSTAMP"
                }
                else{
                    oSelect = "PERIODID0_TSTAMP,LOCDESCR,EXPLINE,RESDESCR,EXPAVAILRATE,EXPMACHINEEFFECTIVENESS,EXPUTILIZATIONRATE,EXPQUALITYRATE,PERIODID0";
                }
            }
            else{
                 if(filterParameter === "YTD"){
                oSelect = "EXPLINE,LOCDESCR,EXPLINEAVAILRATE,EXPLINEUTILIZATIONRATE,EXPLINEQUALITYRATE,EXPLINEMACHINEEFFECTIVENESS,PERIODID3,PERIODID3_TSTAMP"
                }
                else{
                    oSelect = "PERIODID0_TSTAMP,LOCDESCR,EXPLINE,EXPLINEAVAILRATE,EXPLINEUTILIZATIONRATE,EXPLINEQUALITYRATE,EXPLINEMACHINEEFFECTIVENESS,PERIODID0";
                }
                
            }
            
            var sPlantName = this.getView().getModel("localModel").getProperty("/plantName");
            
            
             if(expline){
                aFilter.push(new sap.ui.model.Filter("EXPLINE", sap.ui.model.FilterOperator.EQ, expline));
            }
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
                    var oChart =  this.byId(sap.ui.core.Fragment.createId("_IDTLLineEffectiveTile", "TLvizFrameid"));
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
            //this.showBusyIndicator();
            var oSelectedMachine = oEvent.getSource().getBindingContext("localModel").getObject();
            this.getView().getModel("localModel").setProperty("/expLine", oSelectedMachine.EXPLINE);
            this.getView().getModel("localModel").setProperty("/highlightEXPLINE","highlightEXPLINE");
            this.getView().getModel("localModel").setProperty("/isExplinePresent",true);
            this.getView().getModel("localModel").setProperty("/explineSelectBox",this.getView().getModel("localModel").getProperty("/expLine"))
            this._getMachineLevelData();
            //this.fetchGraphData();
            var oBjh = {EXPLINE: oSelectedMachine.EXPLINE};
            oBjh=JSON.stringify(oBjh);
            var oDomRef = this.getView().byId("_idIFrameThirdLayer").getDomRef();
            oDomRef.contentWindow.postMessage("AreaDetails "+oBjh, '*');
        },

         onBreadcrumbLinkPress:function(oEvent){
             var oSelectedPlant = this.getView().getModel("localModel").getProperty("/plantName");
            var selectedBreadCrumb = oEvent.getSource().getBindingContext('localModel').getObject();
            var oNavParameter = selectedBreadCrumb.navUrl === 'secondlayer' ? {plantDetail:oSelectedPlant}:{};
               var oHolder = this.getView().byId("_idIFrameThirdLayer");

            var oIframeDomRef = oHolder.getDomRef();
            oIframeDomRef.src = "";
            this.getRouter().navTo(selectedBreadCrumb.navUrl,oNavParameter);      
        },
        onChartModePress: function () {
            this.getView().getModel("localModel").setProperty("/isTableMode",false);
        },
        onFilterPress: function (oEvent) {
            var sSelectedFilter = oEvent.getSource().getText();
            this.getView().getModel("localModel").setProperty("/filterSelected", sSelectedFilter);
            this.fetchGraphData()
        },
        onTableModePress: function () {
            this.getView().getModel("localModel").setProperty("/isTableMode",true);
        },
    });
});