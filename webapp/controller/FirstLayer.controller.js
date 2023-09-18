sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "scm/ctc/dashboard/scmctcdashboard/model/Formatter"
], function (BaseController, JSONModel, Formatter) {
    "use strict";
    return BaseController.extend("scm.ctc.dashboard.scmctcdashboard.controller.FirstLayer", {
        formatter: Formatter,
        onInit: function () {
            var oViewModel;
            var microphone = jQuery.sap.getModulePath("scm.ctc.dashboard.scmctcdashboard") + "/model/Microphone.png";
            var plantLegend = jQuery.sap.getModulePath("scm.ctc.dashboard.scmctcdashboard") + "/model/Plant.png";
            var DCLegend = jQuery.sap.getModulePath("scm.ctc.dashboard.scmctcdashboard") + "/model/DC.png";
            var StarLegend = jQuery.sap.getModulePath("scm.ctc.dashboard.scmctcdashboard") + "/model/Star.png";
            oViewModel = new JSONModel({
                country: "Country",
                region: "Region",
               // channel: "Channel",
                plantLegend: plantLegend,
                DCLegend: DCLegend,
                microphone: microphone,
                StarLegend : StarLegend,
                aFilterData: [],
                selectedPlant: null,
                navContent: [{ navName: 'Global Information', navUrl: '' }],
                CircularityBusy: true
            });
            this.setModel(oViewModel, "worklistView");
            this.fnTriggerIframeEvents();
            this.fnGetBearerToken();
            this.getRouter().getRoute("firstlayer").attachPatternMatched(this._onPatternMatched, this);
        },

        fnTriggerIframeEvents: function () {
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
                    var original = data;
                    let firstWord = data.split(" ")[0];
                    if (firstWord === "DETAILS") {
                        var sSelectedPlant = original.substr(original.indexOf(" ") + 1);
                        this.getView().getModel("worklistView").setProperty("/selectedPlant", sSelectedPlant);
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("secondlayer", {
                            plantDetail: sSelectedPlant
                        });
                    } else if (firstWord === "NOCLICK") {
                        this.getView().getModel("worklistView").setProperty("/country", 'Country');
                        this.getView().getModel("worklistView").setProperty("/region", 'Region');
                        this.getView().getModel("worklistView").setProperty("/selectedPlant", null);
                        var oDefaultSelectFilter = { CUSTCOUNTRY: "Country", CUSTREGION: "Region"};
                        //  var oDefaultSelectFilter = { CUSTCOUNTRY: "Country", CUSTREGION: "Region", CUSTCHANNEL: "Channel" };
                        this._setFilterData(oDefaultSelectFilter);
                        this.getChartData();
                        this.getHRData();
                        this.getGlobalSustainabilityData();
                        this.getSalesData();
                        this.getCashPosition();
                        this.getCircularIQData();
                        this.getCashForecaster();
                    } else if (data === "EMEA" || data === "AMERICAS" || data === "APJ") {
                        this.getView().getModel("worklistView").setProperty("/selectedPlant", null);
                        this.getView().getModel("worklistView").setProperty("/country", 'Country');
                       //this.getView().getModel("worklistView").setProperty("/channel", 'Channel');
                        this.getView().getModel("worklistView").setProperty("/region", data);
                        var oDefaultSelectFilter = { CUSTCOUNTRY: "Country", CUSTREGION: "Region"};
                        this._setFilterData(oDefaultSelectFilter);
                        this.getChartData(true);
                        this.getHRData(true);
                        this.getGlobalSustainabilityData(true);
                        this.getSalesData(true);
                        this.getCashPosition();
                        this.getCircularIQData();
                        this.getCashForecaster();
                    } else if(data === "Plant Atlanta" || data === "Plant Frankfurt" || data === "Plant Beijing") {
                        if(data === "Plant Atlanta") {
                             this.getView().getModel("worklistView").setProperty("/region", "AMERICAS");
                             this.getView().getModel("worklistView").setProperty("/country", "US");
                        }
                         if(data === "Plant Frankfurt") {
                             this.getView().getModel("worklistView").setProperty("/region", "EMEA");
                             this.getView().getModel("worklistView").setProperty("/country", "DE");
                        }
                         if(data === "Plant Beijing") {
                            this.getView().getModel("worklistView").setProperty("/region", "APJ");
                            this.getView().getModel("worklistView").setProperty("/country", "CN"); 
                        }
                          var oDefaultSelectFilter = { CUSTCOUNTRY: "Country", CUSTREGION: "Region"};
                        this._setFilterData(oDefaultSelectFilter);
                        this.getChartData(true);
                        this.getHRData(true);
                        this.getGlobalSustainabilityData(true);
                        this.getSalesData(true);
                        this.getCashPosition();
                        this.getCircularIQData();
                        this.getCashForecaster();
                    } else {
                        this.getView().getModel("worklistView").setProperty("/selectedPlant", data);
                    }

                }
            });
        },

        OnPressMicrophone: function () {
            var oViewModel = this.getView().getModel("worklistView");
            var microphone = jQuery.sap.getModulePath("scm.ctc.dashboard.scmctcdashboard") + "/model/Loading.gif";
            oViewModel.setProperty("/microphone", microphone);

            // var that = this;
            if (window.hasOwnProperty('webkitSpeechRecognition')) {
                var recognition = new webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                //te-IN
                recognition.lang = "en-US";
                recognition.start();
                recognition.onresult = function (event) {
                    for (var i = event.resultIndex; i < event.results.length; ++i) {
                        var identificated = event.results[i][0].transcript; //This is what recognizes
                        if (event.results[i].isFinal) {
                            //console.log("Final sentence is : " + identificated);
                            this.speakvalue = identificated;
                            oViewModel.setProperty("/sBidAdditionalNotes", identificated);
                        } else {
                            //console.log("I understood : " + identificated);
                            //    this.speakvalue = identificated;
                            oViewModel.setProperty("/sBidAdditionalNotes", identificated);
                        }
                    };
                    // var microphone = jQuery.sap.getModulePath("scm.ctc.dashboard.scmctcdashboard") + "/model/Microphone.png";
                    // oViewModel.setProperty("/microphone", microphone);
                    var FinalSent = oViewModel.getProperty("/sBidAdditionalNotes");
                    //   var FinalSentValue = PerviousSentFactCase + " " + FinalSent;
                    // oViewModel.setProperty("/PerviousSentFactCase", FinalSentValue);
                    oViewModel.setProperty("/sBidAdditionalNotes", FinalSent);
                    //sap.m.MessageToast.show(FinalSent);
                    // oViewModel.setProperty("/FactCaseValueState", "None");
                };
                recognition.onend = function (EVENT) {
                    oViewModel.setProperty("/sBidAdditionalNotes", EVENT.target.speakvalue);
                    var microphone = jQuery.sap.getModulePath("scm.ctc.dashboard.scmctcdashboard") + "/model/Microphone.png";
                    oViewModel.setProperty("/microphone", microphone);
                    this.fnConnectCAI();
                }.bind(this);
            }
        },

        fnNavigateCashPosition: function () {
            var sUrl = "https://accenture-26.eu10.hcs.cloud.sap/sap/fpa/ui/app.html#/analyticapp?shellMode=embed&/aa/98D11F05BA820D81DAE9B307AC2E0800/";
            var sRegion = this.getView().getModel("worklistView").getProperty("/region");
            var sCountry = this.getView().getModel("worklistView").getProperty("/country");
            sUrl = sUrl + "?url_api=true&p_DBC=" + sCountry + "&p_DBR=" + sRegion + "&view_id=appBuilding";
            window.open(sUrl, "_blank");
        },

        fnNavigateCashForecaster : function () {
            var sUrl = "https://accenture-26.eu10.hcs.cloud.sap/sap/fpa/ui/bo/application/AF80E30BE3A49A4ADDD7635B6F16F729?mode=embed";
            window.open(sUrl, "_blank");
        },

        fnGetBearerToken: function () {
            $.ajax({
                url: "https://sapinnovation-accenture-com.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials",
                contentType: "application/json",
                async: true, //NOTE THIS
                type: 'GET',
                headers: {
                    "Authorization": "Basic " + window.btoa("sb-0e010ac1-0724-4d7f-ae09-d9eb75139ac6-CLONE-RT!b89270|cai-production!b20881:n+gaZDXTyUXsmEwBNeUpZsIjASA=")

                },

                success: function (data) {
                    this.genratedToken = data.access_token;
                    //	this._getLoggedInUserName();
                }.bind(this),
                error: function (e) {
                    this.oBusyDialog.close();
                }.bind(this)
            });
        },

        fnConnectCAI: function () {
            var that = this;
            //check your user-slug in SAP Conversational AI 
            var sText = this.getView().getModel("worklistView").getProperty("/sBidAdditionalNotes");
            var _data = {
                "text": sText
            };

            $.ajax({
                type: "POST",
                data: JSON.stringify(_data),
                url: "https://sapinnovation-accenture-com.sapcai.eu10.hana.ondemand.com/public/api/v2/request",//bot connector callback url you will find under settings>options
                contentType: "application/json",
                scheme: "https",
                headers: {
                    "Authorization": "Bearer " + this.genratedToken,
                    "X-Token": "Token 9e636a0c2fd25e2901077d44b4ce37f3"
                },
                success: function (data) {
                    // do what you need to 
                    
                    //this.getView().getModel("worklistView").setProperty("/sText", data.results.entities.region[0].raw)
                    if (data.results.entities.region[0].raw.indexOf("Atlanta") !== -1 || data.results.entities.region[0].raw.indexOf("Beijing") !== -1 || data.results.entities.region[0].raw.indexOf("Frankfurt") !== -1) {
                      var sSelectedPlant = "";
                        if(data.results.entities.region[0].raw.indexOf("Atlanta") !== -1) {
                            sSelectedPlant = "Plant Atlanta";
                       }
                       else if (data.results.entities.region[0].raw.indexOf("Beijing") !== -1) {
                            sSelectedPlant = "Plant Beijing";
                       }else if(data.results.entities.region[0].raw.indexOf("Frankfurt") !== -1) {
                            sSelectedPlant = "Plant Frankfurt";
                       }
                        this.getView().getModel("worklistView").setProperty("/selectedPlant", sSelectedPlant);
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("secondlayer", {
                            plantDetail: sSelectedPlant
                        });
                    }
                    else if(data.results.entities.region[0].raw.indexOf("China")!== -1 || 
                    data.results.entities.region[0].raw.indexOf("United States")!== -1 || data.results.entities.region[0].raw.indexOf("Germany")!== -1
                    ||data.results.entities.region[0].raw.indexOf("US")!== -1 || data.results.entities.region[0].raw.indexOf("USA")!== -1){
                        var region;
                        if(data.results.entities.region[0].raw.indexOf("China")!== -1){
                            data.results.entities.region[0].raw = "CN";
                            region = "APJ";
                        }
                        if(data.results.entities.region[0].raw.indexOf("United States")!== -1 ||data.results.entities.region[0].raw.indexOf("US")!== -1 ||
                         data.results.entities.region[0].raw.indexOf("USA")!== -1){
                            data.results.entities.region[0].raw = "US";
                            region = "AMERICAS";
                        }
                        if(data.results.entities.region[0].raw.indexOf("Germany")!== -1){
                            data.results.entities.region[0].raw = "DE";
                            region = "EMEA";
                        }
                        this.getView().getModel("worklistView").setProperty("/country", data.results.entities.region[0].raw);

                        this.getView().getModel("worklistView").setProperty("/region", region);
                        var oDefaultSelectFilter = { CUSTCOUNTRY: "Country", CUSTREGION: "Region"};
                        var oBjh = { "Region": region, "Country":this.getView().getModel("worklistView").getProperty("/country")};
                        var oDomRef = this.getView().byId("attachmentframe").getDomRef();
                        oDomRef.contentWindow.postMessage(oBjh, '*');
                        this._setFilterData(oDefaultSelectFilter);
                        this.getChartData(true);
                        this.getHRData(true);
                        this.getGlobalSustainabilityData(true);
                        this.getSalesData(true);
                        this.getCashPosition();
                        this.getCircularIQData();
                        this.getCashForecaster();
                    }
                    else {
                        if (data.results.entities.region[0].raw.indexOf("emea") !== -1 || data.results.entities.region[0].raw.indexOf("Europe") !== -1 || data.results.entities.region[0].raw.indexOf("anaemia") !== -1 ) {
                            data.results.entities.region[0].raw = "EMEA";
                        } else if (data.results.entities.region[0].raw.indexOf("America") !== -1) {
                            data.results.entities.region[0].raw = "AMERICAS"
                        }
                        
                        this.getView().getModel("worklistView").setProperty("/selectedPlant", null);
                        this.getView().getModel("worklistView").setProperty("/country", "Country");
                     //   this.getView().getModel("worklistView").setProperty("/channel", 'Channel');
                        this.getView().getModel("worklistView").setProperty("/region", data.results.entities.region[0].raw);
                        var oDefaultSelectFilter = { CUSTCOUNTRY: "Country", CUSTREGION: "Region"};
                        var oBjh = { "Region": this.getView().getModel("worklistView").getProperty("/region"), "Country": ""};
                        var oDomRef = this.getView().byId("attachmentframe").getDomRef();
                        oDomRef.contentWindow.postMessage(oBjh, '*');
                        this._setFilterData(oDefaultSelectFilter);
                        this.getChartData(true);
                        this.getHRData(true);
                        this.getGlobalSustainabilityData(true);
                        this.getSalesData(true);
                        this.getCashPosition();
                        this.getCircularIQData();
                        this.getCashForecaster();
                    }
                 
                }.bind(this),
                error: function (data) {

                }
            });
        },

        _onPatternMatched: function () {
            //this.showBusyIndicator();
            this.getView().getModel("worklistView").setProperty("/selectedPlant", null);
            this.getFilterKeys();
            this.getChartData();
            this.getHRData(true);
            this.getGlobalSustainabilityData(true)
            this.getSalesData(true);
            this.getCashPosition();
            this.getCircularIQData();
            this.getCashForecaster();

        },

        fnNavToLiquidityForecastDashboard: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("liquidityforecast");
        },

        getCashPosition: function () {
            //this.showBusyIndicator();
            var aFilter = [], sRegionValue;
             var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "YYYYMM"
            });
          
            // var sCountry = this.getView().getModel("worklistView").getProperty("/country");
            var dOldMonthDate = oDateFormat.format(new Date());
            var sRegion = this.getView().getModel("worklistView").getProperty("/region");
            if (sRegion === "Region") {
                sRegionValue = "";
            } else {
                sRegionValue = sRegion;
            }
            var sSerViceUrl = this.getOwnerComponent().getModel("cashPositionModel").sServiceUrl;
            if (sSerViceUrl.endsWith("/")) {
                sSerViceUrl = sSerViceUrl + "CASH_FINAL_KPI?$filter=filter eq '" + sRegionValue + "' and%20DateMonth%20eq%20%20202109";
            } else {
                sSerViceUrl = sSerViceUrl + "/CASH_FINAL_KPI?$filter=filter eq '" + sRegionValue + "' and DateMonth eq " + dOldMonthDate;
            }

            // $.ajax({
            // 	url: sSerViceUrl,
            //     contentType: "application/json",
            // 	async: true, //NOTE THIS
            //     type: 'GET',    
            // 	success: function (data) {
            // 		  this.getView().getModel("worklistView").setProperty("/sCostPosition", data.value[0]);

            // 	}.bind(this),
            // 	error: function (e) {
            // 		this.oBusyDialog.close();
            // 	}.bind(this)
            // });
            this.getView().getModel("worklistView").setProperty("/CircularityBusy", true);
            var oCalLeaveRequest = this.byId(sap.ui.core.Fragment.createId("fgFooterFLTileBottom", "txtCashPosition"));
            var oBndCntx = this.getOwnerComponent().getModel("cashPositionModel").bindContext("/CASH_FINAL_KPI", null, {
                $filter: "filter eq '" + sRegionValue + "' and DateMonth eq " + dOldMonthDate
            });
            oCalLeaveRequest.setBindingContext(oBndCntx, "cashPositionModel");
            this.getView().getModel("worklistView").setProperty("/CircularityBusy", false);

        },

        getCircularIQData: function () {
            this.getView().getModel("worklistView").setProperty("/CircularityBusy", true);
            var oCalLeaveRequest = this.byId(sap.ui.core.Fragment.createId("_IDFLSustainabilityTile", "idCircularSust"));
            var oBndCntx = this.getOwnerComponent().getModel("cashPositionModel").bindContext("/CTI", null, {
                
            });
            oCalLeaveRequest.setBindingContext(oBndCntx, "cashPositionModel");

            this.getView().getModel("worklistView").setProperty("/CircularityBusy", false);
        },

         getCashForecaster: function () {
           
             var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "YYYY-MM-dd"
            });
          
            // var sCountry = this.getView().getModel("worklistView").getProperty("/country");
            var dOldMonthDate = oDateFormat.format(new Date(new Date().setMonth(new Date().getMonth()-3)));
            var dNewMonthDate = oDateFormat.format(new Date(new Date().setMonth(new Date().getMonth()+3))); 
            this.getView().getModel("worklistView").setProperty("/CircularityBusy", true);
            var oCalLeaveRequest = this.byId(sap.ui.core.Fragment.createId("fgFooterFLTileBottom", "forecasterMC"));
            var oBndCntx = this.getOwnerComponent().getModel("cashPositionModel").bindContext("/Liquidity_Forecast", null, {    
                $filter: "start_date ge '" + dOldMonthDate + "' and start_date le '" + dNewMonthDate + "'"
            });
            oCalLeaveRequest.setBindingContext(oBndCntx, "cashPositionModel");

            this.getView().getModel("worklistView").setProperty("/CircularityBusy", false);          
        },

        onUpdateFinished: function (oEvent) {
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        onPress: function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        onShareInJamPress: function () {
            var oViewModel = this.getModel("worklistView"),
                oShareDialog = sap.ui.getCore().createComponent({
                    name: "sap.collaboration.components.fiori.sharing.dialog",
                    settings: {
                        object: {
                            id: location.href,
                            share: oViewModel.getProperty("/shareOnJamTitle")
                        }
                    }
                });
            oShareDialog.open();
        },

        onSearch: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("PLANT_NAME", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        onRefresh: function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        _setFilterData: function (filterObject) {
            var aOdataList = this.getView().getModel("worklistView").getProperty("/aFilterData");
            var oDefaultSelectFilter = { CUSTCOUNTRY: "Country", CUSTREGION: "Region"};
            var aCountryArray = [oDefaultSelectFilter],
                aRegionArray = [oDefaultSelectFilter];
                
                //aChannelArray = [oDefaultSelectFilter];
            aOdataList.forEach((eachData, index) => {
                //country filter
                var isRegionPresent = aRegionArray.find(country => country.CUSTREGION === eachData.CUSTREGION);
                if (!isRegionPresent) {
                    aRegionArray.push(eachData);
                }
                //Region filter
                if (filterObject.CUSTREGION === eachData.CUSTREGION || filterObject.CUSTCOUNTRY === 'Country') {
                    if (!aCountryArray.find(country => country.CUSTCOUNTRY === eachData.CUSTCOUNTRY)) {
                        aCountryArray.push(eachData);
                    }
                }
               
                for(var i=0;i<aCountryArray.length;i++){
                 if(aCountryArray[i].CUSTCOUNTRY==="Country"){
                        aCountryArray[i].COUNTRYNAME="Country";
                }
                if(aCountryArray[i].CUSTCOUNTRY==="CN"){
                        aCountryArray[i].COUNTRYNAME="China";
                }
                 if(aCountryArray[i].CUSTCOUNTRY==="US"){
                        aCountryArray[i].COUNTRYNAME="United States";
                }
                
                 if(aCountryArray[i].CUSTCOUNTRY==="DE"){
                        aCountryArray[i].COUNTRYNAME="Germany";
                }
            }
                //channel filter
                // if (filterObject.CUSTCHANNEL === eachData.CUSTCHANNEL || filterObject.CUSTCHANNEL === 'Channel') {
                //     if (!aChannelArray.find(channel => channel.CUSTCHANNEL === eachData.CUSTCHANNEL)) {
                //         aChannelArray.push(eachData);
                //     }
                // }
            });

            this.getView().getModel("worklistView").setProperty("/aCountryArray", aCountryArray);
            this.getView().getModel("worklistView").setProperty("/aRegionArray", aRegionArray);
            // this.getView().getModel("worklistView").setProperty("/aChannelArray", aChannelArray);


        },

        onHeaderSelectChange: function (oEvent) {
            var oSelectedFilter = oEvent.getParameter("selectedItem").getBindingContext("worklistView").getObject();
            this._setFilterData(oSelectedFilter);
            this.getView().getModel("worklistView").setProperty("/country", oSelectedFilter.CUSTCOUNTRY);
            this.getView().getModel("worklistView").setProperty("/region", oSelectedFilter.CUSTREGION);
          //  this.getView().getModel("worklistView").setProperty("/channel", oSelectedFilter.CUSTCHANNEL);
            var oBjh = { "Region": oSelectedFilter.CUSTREGION, "Country": oSelectedFilter.CUSTCOUNTRY };
            var oDomRef = this.getView().byId("attachmentframe").getDomRef();
            oDomRef.contentWindow.postMessage(oBjh, '*');
            this.getChartData(true);
            this.getHRData(true);
            this.getGlobalSustainabilityData(true);
            this.getSalesData(true);
            this.getCircularIQData();
            this.getCashForecaster();
            this.getCashPosition();
        },

        getChartData: function (isFilter) {
            var aFilter = [];
            var sUrl = "/DUBAIEXPO";
            var oSelect = "PERIODID3_TSTAMP,EXPCOGS,EXPDAYREVENUE,EXPGROSSPROFIT"
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "YYYY-MM-dd00:00:00"
            });
            var sRegion = this.getView().getModel("worklistView").getProperty("/region");
            // var sCountry = this.getView().getModel("worklistView").getProperty("/country");
            var dCurrentDate = new Date(new Date().setHours(0, 0, 0, 0));
            var dOldDate = new Date(new Date(new Date().setFullYear(new Date(new Date().setHours(0, 0, 0, 0)).getFullYear() - 1)).setHours(0, 0, 0, 0));
            dOldDate = new Date(new Date(dOldDate.setMonth(dOldDate.getMonth() + 1)).setHours(0, 0, 0, 0))
            aFilter.push(new sap.ui.model.Filter("PERIODID3_TSTAMP", sap.ui.model.FilterOperator.BT, dOldDate, dCurrentDate));
            aFilter.push(new sap.ui.model.Filter("CURRTOID", sap.ui.model.FilterOperator.EQ, "USD"));
            aFilter.push(new sap.ui.model.Filter("UOMTOID", sap.ui.model.FilterOperator.EQ, "EA"));
            if (isFilter) {
                aFilter.push(new sap.ui.model.Filter("LOCREGION", sap.ui.model.FilterOperator.EQ, sRegion));
                aFilter.push(new sap.ui.model.Filter("CUSTREGION", sap.ui.model.FilterOperator.EQ, sRegion));
                // aFilter.push(new sap.ui.model.Filter("CUSTCOUNTRY", sap.ui.model.FilterOperator.EQ, sCountry));   
            }
            this.getView().getModel().read(sUrl, {
                filters: aFilter,
                urlParameters: { "$select": oSelect },
                success: (oData, oResponse) => {
                    var oLength = this.callsalesformatter(oData.results);
                    var aChartArray = [];
                    for (var i = 0; i < oLength.length; i++) {
                        var obj = {
                            "PeriodName": oLength[i].PERIODID3_TSTAMP.toString().split(" ")[1],
                            "Revenue": parseFloat(oLength[i].EXPDAYREVENUE / 1000000).toFixed(2),
                            "Cogs": parseFloat(oLength[i].EXPCOGS / 1000000).toFixed(2),
                            "GrossProfit": parseFloat(oLength[i].EXPGROSSPROFIT / 1000000).toFixed(2),

                        }
                        aChartArray.push(obj);
                    }
                    this.getView().getModel("worklistView").setProperty("/PLANTDATA", aChartArray);
                    this._setCOntractSectionsGraph();
                    this.getView().setBusy(false);
                },
                error: (oError) => {
                }
            });
        },

        getFilterKeys: function () {
            //this.showBusyIndicator();
            var sUrl = "/DUBAIEXPO";
            var oSelect = "CUSTREGION,CUSTCOUNTRY" //,CUSTCHANNEL"
            var aFilterArray=[];
            aFilterArray.push(new sap.ui.model.Filter("CUSTCOUNTRY", sap.ui.model.FilterOperator.EQ, "CN"));
            aFilterArray.push(new sap.ui.model.Filter("CUSTCOUNTRY", sap.ui.model.FilterOperator.EQ, "DE"));
            aFilterArray.push(new sap.ui.model.Filter("CUSTCOUNTRY", sap.ui.model.FilterOperator.EQ, "US"));
            this.getView().getModel().read(sUrl, {
                filters:aFilterArray,
                urlParameters: { "$select": oSelect },
                success: (oData) => {
                    var aOdataList = oData.results;
                    this.getView().getModel("worklistView").setProperty("/aFilterData", aOdataList);
            
                    var oDefaultSelectFilter = { CUSTCOUNTRY: "Country", CUSTREGION: "Region"};
                    this._setFilterData(oDefaultSelectFilter);
                    //this.hideBusyIndicator();
                },
                error: (oError) => {
                    //this.hideBusyIndicator();
                }
            });
        },

        getGlobalSustainabilityData: function (isFilter) {
            // this.showBusyIndicator();
            var aFilter = [];
            var sUrl = "/DUBAIEXPO";
            var sRegion = this.getView().getModel("worklistView").getProperty("/region");
            var sCountry = this.getView().getModel("worklistView").getProperty("/country");
            var oSelect = "EXPSUPPLYCHAINMILES,EXPWATERRECYCLERATIO,EXPENERGYCONSUMPRED,EXPINDIRECTCO2EMMISSION,EXPMATERIALSRECYCLERATE,EXPPLANADHERENCE,EXPPLANADHERENCE3DAYS,EXPPLANADHERENCEDTD,EXPPLANADHERENCEMTD,EXPPLANADHERENCEWTD,EXPPLANADHERENCEYTD,EXPPLANTAVAILABILITYRATE,EXPPLANTAVAILRATE3DAYS,EXPPLANTAVAILRATEDTD,EXPPLANTAVAILRATEMTD,EXPPLANTAVAILRATEWTD,EXPPLANTAVAILRATEYTD"
            aFilter.push(new sap.ui.model.Filter("LOCTYPE", sap.ui.model.FilterOperator.EQ, "PLANT"))
            
            if (isFilter) {
                if( sRegion !== "Region"){
                    aFilter.push(new sap.ui.model.Filter("LOCREGION", sap.ui.model.FilterOperator.EQ, sRegion));
                }
                if (sCountry !== "Country") {
                    aFilter.push(new sap.ui.model.Filter("CUSTCOUNTRY", sap.ui.model.FilterOperator.EQ, sCountry));
                }
                
            }
            aFilter.push(new sap.ui.model.Filter("PERIODID1", sap.ui.model.FilterOperator.EQ, new Date().getFullYear()));
            this.getView().getModel("oGlobalModel").setProperty("/planAdherenceBusy", true);
            this.getView().getModel("oGlobalModel").setProperty("/plantAvailabilityBusy", true);

            this.getView().getModel().read(sUrl, {
                filters: aFilter,
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                success: (oData, oResponse) => {
                    this.getView().getModel("worklistView").setProperty("/sEXPWATERRECYCLERATIO", parseFloat(oData.results[0].EXPWATERRECYCLERATIO).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPSUPPLYCHAINMILES", parseFloat(oData.results[0].EXPSUPPLYCHAINMILES).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPMATERIALSRECYCLERATE", parseFloat(oData.results[0].EXPMATERIALSRECYCLERATE).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPINDIRECTCO2EMMISSION", parseFloat(oData.results[0].EXPINDIRECTCO2EMMISSION).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPENERGYCONSUMPRED", parseFloat(oData.results[0].EXPENERGYCONSUMPRED).toFixed(1));
                    this.getView().getModel("oGlobalModel").setProperty("/operationKPIData", oData.results[0]);
                    //this.hideBusyIndicator();
                    this.getView().getModel("oGlobalModel").setProperty("/planAdherenceBusy", false)
                    this.getView().getModel("oGlobalModel").setProperty("/plantAvailabilityBusy", false)

                },

                error: (oError) => {
                    //this.hideBusyIndicator();
                    this.getView().getModel("oGlobalModel").setProperty("/planAdherenceBusy", false)
                    this.getView().getModel("oGlobalModel").setProperty("/plantAvailabilityBusy", false)
                }
            });
        },

        getHRData: function (isFilter) {
            //this.showBusyIndicator();
            var aFilter = [];
            var sUrl = "/DUBAIEXPO";
            var sRegion = this.getView().getModel("worklistView").getProperty("/region");
             var sCountry = this.getView().getModel("worklistView").getProperty("/country");
          
            var oSelect = "EXPHEADCOUNTLGBT,EXPHEADCOUNTFEMALE,EXPHEADCOUNTMALE,EXPTOTALHEADCOUNT,EXPDIVERSITYRATIO"
            if (isFilter) {
                if (sRegion !== "Region") {
                    aFilter.push(new sap.ui.model.Filter("LOCREGION", sap.ui.model.FilterOperator.EQ, sRegion));
                }
                if (sCountry !== "Country") {
                    aFilter.push(new sap.ui.model.Filter("CUSTCOUNTRY", sap.ui.model.FilterOperator.EQ, sCountry));
                }
            }
            this.getView().getModel("worklistView").setProperty("/diversityRatioBusy", true);
            this.getView().getModel("worklistView").setProperty("/totalHeadcountBusy", true);
            this.getView().getModel().read(sUrl, {
                filters: aFilter,
                urlParameters: { "$select": oSelect },
                //for loading oData into JSON Model split
                success: (oData, oResponse) => {
                    var iFinalValue = parseInt(oData.results[0].EXPHEADCOUNTMALE) + parseInt(oData.results[0].EXPHEADCOUNTFEMALE) + parseInt(oData.results[0].EXPHEADCOUNTLGBT);
                    oData.results[0].EXPHEADCOUNTMALE = parseInt(oData.results[0].EXPHEADCOUNTMALE) / iFinalValue;
                    oData.results[0].EXPHEADCOUNTFEMALE = parseInt(oData.results[0].EXPHEADCOUNTFEMALE) / iFinalValue;
                    oData.results[0].EXPHEADCOUNTLGBT = parseInt(oData.results[0].EXPHEADCOUNTLGBT) / iFinalValue;
                    this.getView().getModel("oGlobalModel").setProperty("/HRKPIData", oData.results[0]);
                    //this.hideBusyIndicator();
                    this.getView().getModel("worklistView").setProperty("/diversityRatioBusy", false);
                    this.getView().getModel("worklistView").setProperty("/totalHeadcountBusy", false);
                },
                error: (oError) => {
                    //this.hideBusyIndicator();
                    this.getView().getModel("worklistView").setProperty("/diversityRatioBusy", false);
                    this.getView().getModel("worklistView").setProperty("/totalHeadcountBusy", false);
                }
            });
        },

        getSalesData: function (isFilter) {
            //this.showBusyIndicator();
            var aFilter = [];
            var sUrl = "/DUBAIEXPO";
            var sRegion = this.getView().getModel("worklistView").getProperty("/region");
            var sCountry = this.getView().getModel("worklistView").getProperty("/country");
            var oSelect = "EXPCUSTOTIF3D,EXPCUSTOTIFLD,EXPCUSTOTIFMTD,EXPCUSTOTIFWTD,EXPCUSTOTIFYTD,EXPCOGS3DAYS,EXPCOGSCWTD,EXPCOGSDTD,EXPCOGSMTD,EXPCOGSYTD,EXPREVENUE3DAYS,EXPREVENUECWTD,EXPREVENUEDTD,EXPREVENUEMTD,EXPREVENUEYTD,EXPGROSSPROFIT3DAYS,EXPGROSSPROFITCWTD,EXPGROSSPROFITDTD,EXPGROSSPROFITMTD,EXPGROSSPROFITYTD"
            aFilter.push(new sap.ui.model.Filter("CURRTOID", sap.ui.model.FilterOperator.EQ, "USD"));
            aFilter.push(new sap.ui.model.Filter("UOMTOID", sap.ui.model.FilterOperator.EQ, "EA"));
            aFilter.push(new sap.ui.model.Filter("PERIODID1", sap.ui.model.FilterOperator.EQ, new Date().getFullYear()));
            if (isFilter) {
                 if( sRegion !== "Region"){
                   aFilter.push(new sap.ui.model.Filter("CUSTREGION", sap.ui.model.FilterOperator.EQ, sRegion));
                }
                
                if (sCountry !== "Country") {
                    aFilter.push(new sap.ui.model.Filter("CUSTCOUNTRY", sap.ui.model.FilterOperator.EQ, sCountry));
                }

            }
            this.getView().getModel("worklistView").setProperty("/SalesBusy", true)
            this.getView().getModel().read(sUrl, {
                filters: aFilter,
                urlParameters: { "$select": oSelect },
                success: (oData, oResponse) => {
                    oData.results = this.callsalesformatter(oData.results);
                    this.getView().getModel("worklistView").setProperty("/sEXPGROSSPROFITYTD", (oData.results[0].EXPGROSSPROFITYTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPGROSSPROFITDTD", (oData.results[0].EXPGROSSPROFITDTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPGROSSPROFIT3DAYS", (oData.results[0].EXPGROSSPROFIT3DAYS / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPGROSSPROFITCWTD", (oData.results[0].EXPGROSSPROFITCWTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPGROSSPROFITMTD", (oData.results[0].EXPGROSSPROFITMTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPCOGSYTD", (oData.results[0].EXPCOGSYTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPCOGSDTD", (oData.results[0].EXPCOGSDTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPCOGS3DAYS", (oData.results[0].EXPCOGS3DAYS / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPCOGSCWTD", (oData.results[0].EXPCOGSCWTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPCOGSMTD", (oData.results[0].EXPCOGSMTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPREVENUEDTD", (oData.results[0].EXPREVENUEDTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPREVENUE3DAYS", (oData.results[0].EXPREVENUE3DAYS / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPREVENUECWTD", (oData.results[0].EXPREVENUECWTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPREVENUEMTD", (oData.results[0].EXPREVENUEMTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIF3D", parseFloat(oData.results[0].EXPCUSTOTIF3D).toFixed(2));
                    this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFLD", parseFloat(oData.results[0].EXPCUSTOTIFLD).toFixed(2));
                    if(this.getView().getModel("worklistView").getProperty("/country")==="US" && parseInt(oData.results[0].EXPCUSTOTIFYTD) === 0){
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFYTD", "95.0");
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFMTD", "92.0");
                    this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFWTD", "90.0");
                    }else if(this.getView().getModel("worklistView").getProperty("/country")==="CN" && parseInt(oData.results[0].EXPCUSTOTIFYTD) === 0){
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFYTD", "93.0");
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFMTD", "91.0");
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFWTD", "90.0");
                    }else if((this.getView().getModel("worklistView").getProperty("/country")==="Country"&&this.getView().getModel("worklistView").getProperty("/region") ==="AMERICAS") && parseInt(oData.results[0].EXPCUSTOTIFYTD) === 0){
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFYTD", "95.0");
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFMTD", "92.0");
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFWTD", "90.0");
                    }else if((this.getView().getModel("worklistView").getProperty("/country")==="Country"&&this.getView().getModel("worklistView").getProperty("/region") ==="APJ") && parseInt(oData.results[0].EXPCUSTOTIFYTD) === 0){
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFYTD", "93.0");
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFMTD", "91.0");
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFWTD", "90.0");
                    }else{
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFYTD", parseFloat(oData.results[0].EXPCUSTOTIFYTD).toFixed(2));
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFMTD", parseFloat(oData.results[0].EXPCUSTOTIFMTD).toFixed(2));
                        this.getView().getModel("worklistView").setProperty("/sEXPCUSTOTIFWTD", parseFloat(oData.results[0].EXPCUSTOTIFWTD).toFixed(2));
                    }
                    if(parseInt(oData.results[0].EXPREVENUEYTD)===0){
                        var rev = parseFloat((oData.results[0].EXPGROSSPROFITYTD / 1000000).toFixed(1)) + parseFloat((oData.results[0].EXPCOGSYTD / 1000000).toFixed(1));
                    this.getView().getModel("worklistView").setProperty("/sEXPREVENUEYTD", rev.toFixed(1).toString());
                    }else{
                        this.getView().getModel("worklistView").setProperty("/sEXPREVENUEYTD", (oData.results[0].EXPREVENUEYTD / 1000000).toFixed(1));
                    }
                    
                    
                    
                    //this.hideBusyIndicator();
                    this.getView().getModel("worklistView").setProperty("/SalesBusy", false);
                },
                error: (oError) => {
                    //this.hideBusyIndicator();
                    this.getView().getModel("worklistView").setProperty("/SalesBusy", false);
                }
            });
        },

        _setCOntractSectionsGraph: function () {
            var oViewModel = this.getView().getModel("worklistView");
            //var oVizFrame = this.getView().byId("vizFrameid");
            var oVizFrame = this.byId(sap.ui.core.Fragment.createId("fgFooterFLTileBottom", "vizFrameid"));
            oVizFrame.removeAllFeeds();
            oVizFrame.setVizType('stacked_combination');
            oVizFrame.setUiConfig({
                "applicationSet": "fiori"
            });

            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "Period Name",
                    value: "{PeriodName}"
                }],
                measures: [{
                    name: "Gross Profit",
                    value: "{GrossProfit}",
                }, {
                    name: "Revenue",
                    value: "{Revenue}"
                }, {
                    name: "Cogs",
                    value: "{Cogs}"
                }],

                data: {
                    path: "/PLANTDATA"
                }

            });
            oVizFrame.setModel(oViewModel);
            oVizFrame.setDataset(oDataset);
            var feedvalueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Gross Profit", "Revenue", "Cogs"]
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
                        min: 23,
                        max: 23
                    },
                    gap: {
                        barSpacing: 0
                    },
                    colorPalette: ['#9A5AED', '#9A5AED', '#f0f1f5'],
                    dataShape: {
                        primaryAxis: ["line", "bar", "bar"]
                    }
                },
                legend: {
                    clickable: false,
                    visible: false
                },

            });
            // var oPopOver = this.getView().byId("idPopOver");
            // oPopOver.connect(oVizFrame.getVizUid());
        },

        onSustainabilityLinkPress: function () {
            window.open("https://app.ctitool.com/cti/guide/step4", "_blank")
        }

    });
});