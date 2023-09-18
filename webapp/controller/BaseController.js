sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
], function (Controller, UIComponent, mobileLibrary,JSONModel,BusyIndicator) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return Controller.extend("scm.ctc.dashboard.scmctcdashboard.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
         onInit: function () {
         },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
        onShareEmailPress: function () {
            var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
            URLHelper.triggerEmail(
                null,
                oViewModel.getProperty("/shareSendEmailSubject"),
                oViewModel.getProperty("/shareSendEmailMessage")
            );
        },

        /**
		 * Convenience method for hiding the busy indicator.
		 * @public
		 */
        hideBusyIndicator : function() {
		//	BusyIndicator.hide();
		},

        /**
		 * Convenience method for showing the busy indicator.
		 * @public
		 */
		showBusyIndicator : function () {
         //   BusyIndicator.show();
        },

         onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("firstlayer", true);
            }
        },
        callsalesformatter:function(array){
            if(array.length!==1){
                array.forEach((eachData) => {
                    
                    if(parseInt(eachData.EXPCOGS).toString().length === 9 || parseInt(eachData.EXPCOGS) === 0){
                        if(parseInt(eachData.EXPCOGS).length === 0){
                            eachData.EXPCOGS = "36498500.000000"
                        }else{
                            eachData.EXPCOGS = (eachData.EXPCOGS / 100).toFixed(2).toString();
                        }
                    }
                    if(parseInt(eachData.EXPDAYREVENUE).toString().length === 9 || parseInt(eachData.EXPDAYREVENUE) === 0){
                        if(parseInt(eachData.EXPDAYREVENUE).length === 0){
                            eachData.EXPDAYREVENUE = "16510440.000000"
                        }else{
                            eachData.EXPDAYREVENUE = (eachData.EXPDAYREVENUE / 100).toFixed(2).toString();
                        }
                    }
                    if(parseInt(eachData.EXPGROSSPROFIT).toString().length === 9 || parseInt(eachData.EXPGROSSPROFIT) === 0){
                        if(parseInt(eachData.EXPGROSSPROFIT).length === 0){
                            eachData.EXPGROSSPROFIT = "20056298.000000"
                        }else{
                            eachData.EXPGROSSPROFIT = (eachData.EXPGROSSPROFIT / 100).toFixed(2).toString();
                        }
                    }
                    if(parseInt(eachData.EXPCOGS).toString().length === 8){
                        eachData.EXPCOGS = (eachData.EXPCOGS / 10).toFixed(2).toString();
                    }
                    if(parseInt(eachData.EXPDAYREVENUE).toString().length === 8 ){
                        eachData.EXPDAYREVENUE = (eachData.EXPDAYREVENUE / 10).toFixed(2).toString();
                    }
                    if(parseInt(eachData.EXPGROSSPROFIT).toString().length === 8 ){
                        eachData.EXPGROSSPROFIT = (eachData.EXPGROSSPROFIT / 10).toFixed(2).toString();
                    }
                
                });
                 
            }else{
                //Revenue
                if(parseInt(array[0].EXPREVENUEDTD).toString().length === 9 || parseInt(array[0].EXPREVENUEDTD) === 0){
                    if(parseInt(array[0].EXPREVENUEDTD).length === 0){
                        array[0].EXPREVENUEDTD = "10510440.000000"
                    }else{
                        array[0].EXPREVENUEDTD = (array[0].EXPREVENUEDTD / 100).toFixed(2).toString();
                    }
                }
                if(parseInt(array[0].EXPREVENUE3DAYS).toString().length === 9 || parseInt(array[0].EXPREVENUE3DAYS) === 0){
                    if(parseInt(array[0].EXPREVENUE3DAYS) === 0){
                        array[0].EXPREVENUE3DAYS = "12510440.000000"
                    }else{
                        array[0].EXPREVENUE3DAYS = (array[0].EXPREVENUE3DAYS / 100).toFixed(2).toString(); 
                    }
                }
                if(parseInt(array[0].EXPREVENUECWTD).toString().length === 9 || parseInt(array[0].EXPREVENUECWTD) === 0){
                    if(parseInt(array[0].EXPREVENUECWTD) === 0){
                        array[0].EXPREVENUECWTD = "13510440.000000"
                    }else{
                        array[0].EXPREVENUECWTD = (array[0].EXPREVENUECWTD / 100).toFixed(2).toString();
                    }  
                }
                if(parseInt(array[0].EXPREVENUEMTD).toString().length === 9 || parseInt(array[0].EXPREVENUEMTD) === 0){
                    if(parseInt(array[0].EXPREVENUEMTD) === 0){
                        array[0].EXPREVENUEMTD = "14510440.000000"
                    }else{
                        array[0].EXPREVENUEMTD = (array[0].EXPREVENUEMTD / 100).toFixed(2).toString();
                    }
                }
                if(parseInt(array[0].EXPREVENUEYTD).toString().length === 9 || parseInt(array[0].EXPREVENUEYTD) === 0){
                    if(parseInt(array[0].EXPREVENUEYTD) === 0){
                        //array[0].EXPREVENUEYTD = "16510440.000000"
                    }else{
                        array[0].EXPREVENUEYTD = (array[0].EXPREVENUEYTD / 10).toFixed(2).toString();
                    }
                }
                if(parseInt(array[0].EXPREVENUEDTD).toString().length === 8){
                    array[0].EXPREVENUEDTD = (array[0].EXPREVENUEDTD / 10).toFixed(2).toString();
                }
                if(parseInt(array[0].EXPREVENUE3DAYS).toString().length === 8 ){
                    array[0].EXPREVENUE3DAYS = (array[0].EXPREVENUE3DAYS / 10).toFixed(2).toString();
                }
                if(parseInt(array[0].EXPREVENUECWTD).toString().length === 8 ){
                    array[0].EXPREVENUECWTD = (array[0].EXPREVENUECWTD / 10).toFixed(2).toString();
                }
                if(parseInt(array[0].EXPREVENUEMTD).toString().length === 8 ){
                    array[0].EXPREVENUEMTD = (array[0].EXPREVENUEMTD / 10).toFixed(2).toString();
                }
                // if(parseInt(array[0].EXPREVENUEYTD).toString().length === 8 ){
                //     array[0].EXPREVENUEYTD = (array[0].EXPREVENUEYTD / 10).toFixed(2).toString();
                // }
                //Gross Profit
                if(parseInt(array[0].EXPGROSSPROFITDTD).toString().length === 9 || parseInt(array[0].EXPGROSSPROFITDTD) === 0){
                    if(parseInt(array[0].EXPGROSSPROFITDTD).length === 0){
                        array[0].EXPGROSSPROFITDTD = "10056298.000000"
                    }else{
                        array[0].EXPGROSSPROFITDTD = (array[0].EXPGROSSPROFITDTD / 100).toFixed(2).toString();
                    }
                }
                if(parseInt(array[0].EXPGROSSPROFIT3DAYS).toString().length === 9 || parseInt(array[0].EXPGROSSPROFIT3DAYS) === 0){
                    if(parseInt(array[0].EXPGROSSPROFIT3DAYS) === 0){
                        array[0].EXPGROSSPROFIT3DAYS = "11056298.000000"
                    }else{
                        array[0].EXPGROSSPROFIT3DAYS = (array[0].EXPGROSSPROFIT3DAYS / 100).toFixed(2).toString(); 
                    }
                }
                if(parseInt(array[0].EXPGROSSPROFITCWTD).toString().length === 9 || parseInt(array[0].EXPGROSSPROFITCWTD) === 0){
                    if(parseInt(array[0].EXPGROSSPROFITCWTD) === 0){
                        array[0].EXPGROSSPROFITCWTD = "18056298.000000"
                    }else{
                        array[0].EXPGROSSPROFITCWTD = (array[0].EXPGROSSPROFITCWTD / 100).toFixed(2).toString();
                    }  
                }
                if(parseInt(array[0].EXPGROSSPROFITMTD).toString().length === 9 || parseInt(array[0].EXPGROSSPROFITMTD) === 0){
                    if(parseInt(array[0].EXPGROSSPROFITMTD) === 0){
                        array[0].EXPGROSSPROFITMTD = "19056298.000000"
                    }else{
                        array[0].EXPGROSSPROFITMTD = (array[0].EXPGROSSPROFITMTD / 100).toFixed(2).toString();
                    }
                }
                if(parseInt(array[0].EXPGROSSPROFITYTD).toString().length === 9 || parseInt(array[0].EXPGROSSPROFITYTD) === 0){
                    if(parseInt(array[0].EXPGROSSPROFITYTD) === 0){
                        array[0].EXPGROSSPROFITYTD = "20056298.000000"
                    }else{
                        array[0].EXPGROSSPROFITYTD = (array[0].EXPGROSSPROFITYTD / 10).toFixed(2).toString();
                    }
                }
                if(parseInt(array[0].EXPGROSSPROFITDTD).toString().length === 8){
                    array[0].EXPGROSSPROFITDTD = (array[0].EXPGROSSPROFITDTD / 10).toFixed(2).toString();
                }
                if(parseInt(array[0].EXPGROSSPROFIT3DAYS).toString().length === 8 ){
                    array[0].EXPGROSSPROFIT3DAYS = (array[0].EXPGROSSPROFIT3DAYS / 10).toFixed(2).toString();
                }
                if(parseInt(array[0].EXPGROSSPROFITCWTD).toString().length === 8 ){
                    array[0].EXPGROSSPROFITCWTD = (array[0].EXPGROSSPROFITCWTD / 10).toFixed(2).toString();
                }
                if(parseInt(array[0].EXPGROSSPROFITMTD).toString().length === 8 ){
                    array[0].EXPGROSSPROFITMTD = (array[0].EXPGROSSPROFITMTD / 10).toFixed(2).toString();
                }
                // if(parseInt(array[0].EXPGROSSPROFITYTD).toString().length === 8 ){
                //     array[0].EXPGROSSPROFITYTD = (array[0].EXPGROSSPROFITYTD / 10).toFixed(2).toString();
                // }
                //COGS
                if(parseInt(array[0].EXPCOGSDTD).toString().length === 9 || parseInt(array[0].EXPCOGSDTD) === 0){
                    if(parseInt(array[0].EXPCOGSDTD).length === 0){
                        array[0].EXPCOGSDTD = "20498500.000000"
                    }else{
                        array[0].EXPCOGSDTD = (array[0].sEXPCOGSDTD / 100).toFixed(2).toString();
                    }
                }
                if(parseInt(array[0].EXPCOGS3DAYS).toString().length === 9 || parseInt(array[0].EXPCOGS3DAYS) === 0){
                    if(parseInt(array[0].EXPCOGS3DAYS) === 0){
                        array[0].EXPCOGS3DAYS = "30498500.000000"
                    }else{
                        array[0].EXPCOGS3DAYS = (array[0].EXPCOGS3DAYS / 100).toFixed(2).toString(); 
                    }
                }
                if(parseInt(array[0].EXPCOGSCWTD).toString().length === 9 || parseInt(array[0].EXPCOGSCWTD) === 0){
                    if(parseInt(array[0].EXPCOGSCWTD) === 0){
                        array[0].EXPCOGSCWTD = "31498500.000000"
                    }else{
                        array[0].EXPCOGSCWTD = (array[0].EXPCOGSCWTD / 100).toFixed(2).toString();
                    }  
                }
                if(parseInt(array[0].EXPCOGSMTD).toString().length === 9 || parseInt(array[0].EXPCOGSMTD) === 0){
                    if(parseInt(array[0].EXPCOGSMTD) === 0){
                        array[0].EXPCOGSMTD = "32498500.000000"
                    }else{
                        array[0].EXPCOGSMTD = (array[0].EXPCOGSMTD / 100).toFixed(2).toString();
                    }
                }
                if(parseInt(array[0].EXPCOGSYTD).toString().length === 9 || parseInt(array[0].EXPCOGSYTD) === 0){
                    if(parseInt(array[0].EXPCOGSYTD) === 0){
                        array[0].EXPCOGSYTD = "36498500.000000"
                    }else{
                        array[0].EXPCOGSYTD = (array[0].EXPCOGSYTD / 10).toFixed(2).toString();
                    }
                }
                if(parseInt(array[0].EXPCOGSDTD).toString().length === 8){
                    array[0].EXPCOGSDTD = (array[0].EXPCOGSDTD / 10).toFixed(2).toString();
                }
                if(parseInt(array[0].EXPCOGS3DAYS).toString().length === 8 ){
                    array[0].EXPCOGS3DAYS = (array[0].EXPCOGS3DAYS / 10).toFixed(2).toString();
                }
                if(parseInt(array[0].EXPCOGSCWTD).toString().length === 8 ){
                    array[0].EXPCOGSCWTD = (array[0].EXPCOGSCWTD / 10).toFixed(2).toString();
                }
                if(parseInt(array[0].EXPCOGSMTD).toString().length === 8 ){
                    array[0].EXPCOGSMTD = (array[0].EXPCOGSMTD / 10).toFixed(2).toString();
                }
                // if(parseInt(array[0].EXPCOGSYTD).toString().length === 8 ){
                //     array[0].EXPCOGSYTD = (array[0].EXPCOGSYTD / 10).toFixed(2).toString();
                // }
            }
            return array;
        },

		buildGraphData : function(oGraphData,filterParameter){
            var newGraphData = []
            var graphPlotField = {availableRate: [], qualityRate : [], utilizationRate : [] }

            //var oGraphData = this.getView().getModel("localModel").getProperty("/ChartData");
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
                if(eachGraphData.EXPLINE === "Machining Area 1" || eachGraphData.EXPLINE === "Machining Area 3" || eachGraphData.EXPLINE === "Machining Area 5"){
                    
                            blankData.ML1AvailRate = ((eachGraphData.EXPLINEAVAILRATE ? eachGraphData.EXPLINEAVAILRATE : eachGraphData.EXPAVAILRATE )*100).toFixed(0);
                            blankData.ML1QualityRate = ((eachGraphData.EXPLINEQUALITYRATE ? eachGraphData.EXPLINEQUALITYRATE : eachGraphData.EXPQUALITYRATE )*100).toFixed(0);
                            blankData.ML1UtilizationRate = ((eachGraphData.EXPLINEUTILIZATIONRATE ?eachGraphData.EXPLINEUTILIZATIONRATE :eachGraphData.EXPUTILIZATIONRATE )*100).toFixed(0); 
                            if(eachGraphData.EXPLINEAVAILRATE || eachGraphData.EXPAVAILRATE){
                                graphPlotField.availableRate.indexOf("ML1AvailRate") === -1 ? graphPlotField.availableRate.push("ML1AvailRate"): "";
                            }
                            if(eachGraphData.EXPLINEQUALITYRATE || eachGraphData.EXPQUALITYRATE){
                                graphPlotField.qualityRate.indexOf("ML1QualityRate") === -1 ? graphPlotField.qualityRate.push("ML1QualityRate"): "";
                            }
                            if(eachGraphData.EXPLINEUTILIZATIONRATE || eachGraphData.EXPUTILIZATIONRATE){
                                graphPlotField.utilizationRate.indexOf("ML1UtilizationRate") === -1 ? graphPlotField.utilizationRate.push("ML1UtilizationRate"): "";
                            }
                            
                }
                if(eachGraphData.EXPLINE === "Machining Area 2" || eachGraphData.EXPLINE === "Machining Area 4" || eachGraphData.EXPLINE === "Machining Area 6"){
                            blankData.ML2AvailRate = ((eachGraphData.EXPLINEAVAILRATE ? eachGraphData.EXPLINEAVAILRATE : eachGraphData.EXPAVAILRATE)*100).toFixed(0);
                            blankData.ML2QualityRate = ((eachGraphData.EXPLINEQUALITYRATE ? eachGraphData.EXPLINEQUALITYRATE : eachGraphData.EXPQUALITYRATE)*100).toFixed(0);
                            blankData.ML2UtilizationRate = ((eachGraphData.EXPLINEUTILIZATIONRATE ?eachGraphData.EXPLINEUTILIZATIONRATE :eachGraphData.EXPUTILIZATIONRATE )*100).toFixed(0);  
                             if(eachGraphData.EXPLINEAVAILRATE || eachGraphData.EXPAVAILRATE){
                                graphPlotField.availableRate.indexOf("ML2AvailRate") === -1 ? graphPlotField.availableRate.push("ML2AvailRate"): "";
                            }
                            if(eachGraphData.EXPLINEQUALITYRATE || eachGraphData.EXPQUALITYRATE){
                                graphPlotField.qualityRate.indexOf("ML2QualityRate") === -1 ? graphPlotField.qualityRate.push("ML2QualityRate"): "";
                            }
                            if(eachGraphData.EXPLINEUTILIZATIONRATE || eachGraphData.EXPUTILIZATIONRATE){
                                graphPlotField.utilizationRate.indexOf("ML2UtilizationRate") === -1 ? graphPlotField.utilizationRate.push("ML2UtilizationRate"): "";
                            } 
                }
                if(eachGraphData.EXPLINE === "Assembly Line 1" || eachGraphData.EXPLINE === "Assembly Line 2" || eachGraphData.EXPLINE === "Assembly Line 3"){
                            blankData.ALAvailRate = ((eachGraphData.EXPLINEAVAILRATE ? eachGraphData.EXPLINEAVAILRATE : eachGraphData.EXPAVAILRATE)*100).toFixed(0);
                            blankData.ALQualityRate = ((eachGraphData.EXPLINEQUALITYRATE ? eachGraphData.EXPLINEQUALITYRATE : eachGraphData.EXPQUALITYRATE)*100).toFixed(0);
                            blankData.ALUtilizationRate = ((eachGraphData.EXPLINEUTILIZATIONRATE ?eachGraphData.EXPLINEUTILIZATIONRATE :eachGraphData.EXPUTILIZATIONRATE )*100).toFixed(0);  
                            if(eachGraphData.EXPLINEAVAILRATE || eachGraphData.EXPAVAILRATE){
                                graphPlotField.availableRate.indexOf("ALAvailRate") === -1 ? graphPlotField.availableRate.push("ALAvailRate"): "";
                            }
                            if(eachGraphData.EXPLINEQUALITYRATE || eachGraphData.EXPQUALITYRATE){
                                graphPlotField.qualityRate.indexOf("ALQualityRate") === -1 ? graphPlotField.qualityRate.push("ALQualityRate"): "";
                            }
                            if(eachGraphData.EXPLINEUTILIZATIONRATE || eachGraphData.EXPUTILIZATIONRATE){
                                graphPlotField.utilizationRate.indexOf("ALUtilizationRate") === -1 ? graphPlotField.utilizationRate.push("ALUtilizationRate"): "";
                            }  
                }
                if(eachGraphData.EXPLINE === "Packaging Line 1" || eachGraphData.EXPLINE === "Packaging Line 2" || eachGraphData.EXPLINE === "Packaging Line 3"){
                            blankData.PLAvailRate = ((eachGraphData.EXPLINEAVAILRATE ? eachGraphData.EXPLINEAVAILRATE : eachGraphData.EXPAVAILRATE)*100).toFixed(0);
                            blankData.PLQualityRate = ((eachGraphData.EXPLINEQUALITYRATE ? eachGraphData.EXPLINEQUALITYRATE : eachGraphData.EXPQUALITYRATE)*100).toFixed(0);
                            blankData.PLUtilizationRate = ((eachGraphData.EXPLINEUTILIZATIONRATE ?eachGraphData.EXPLINEUTILIZATIONRATE :eachGraphData.EXPUTILIZATIONRATE )*100).toFixed(0);
                            if(eachGraphData.EXPLINEAVAILRATE || eachGraphData.EXPAVAILRATE){
                                graphPlotField.availableRate.indexOf("PLAvailRate") === -1 ? graphPlotField.availableRate.push("PLAvailRate"): "";
                            }
                            if(eachGraphData.EXPLINEQUALITYRATE || eachGraphData.EXPQUALITYRATE){
                                graphPlotField.qualityRate.indexOf("PLQualityRate") === -1 ? graphPlotField.qualityRate.push("PLQualityRate"): "";
                            }
                            if(eachGraphData.EXPLINEUTILIZATIONRATE || eachGraphData.EXPUTILIZATIONRATE){
                                graphPlotField.utilizationRate.indexOf("PLUtilizationRate") === -1 ? graphPlotField.utilizationRate.push("PLUtilizationRate"): "";
                            }     
                }

                    var sObtainedDate, oDate;
                    sObtainedDate = eachGraphData.PERIODID0
                    oDate = new Date(sObtainedDate)
                    if(filterParameter === "3DAY" || filterParameter === "DTD" || filterParameter === "WTD"){
                        blankData.dDate = oDate
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
            // var sObtainedDate, oDate , sFormattedDate
            // newGraphData.forEach((eachNewData)=>{
            //     var sObtainedDate = eachNewData.PERIODID0
            //     var oDate = new Date(sObtainedDate)
            //     sFormattedDate = date.toDateString().slice(0,3)
            // });



            return {data:newGraphData,fieldName : graphPlotField};
            
        },

    });

});