sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], function (BaseController, History, JSONModel) {
    "use strict";
    return BaseController.extend("scm.ctc.dashboard.scmctcdashboard.controller.LiquidityForecast", {
        onInit: function () {
            var oViewModel = new JSONModel({
                sSACURL: "https://accenture-17.eu10.hcs.cloud.sap/sap/fpa/ui/tenants/4c587/app.html#/analyticapp&/aa/F3A3740233066822E42CCFE75BEBB88C/?mode=present&view_id=appBuilding"
            });
            this.setModel(oViewModel, "liquidityForecastView");
            this.getRouter().getRoute("liquidityforecast").attachPatternMatched(this._onLiquidityForecastMatched, this);
        },

        fnSACPress: function () {
            // var oDomRef = this.getView().byId("attachmentframeSecond").getDomRef();
            // oDomRef.contentWindow.postMessage("Germany", '*');

        },

        onAfterRendering: function () {

        },

        _onLiquidityForecastMatched: function () {
            var oDomRef = this.getView().byId("attachmentframeSecond").getDomRef();
            oDomRef.contentWindow.postMessage("Germany", '*');
        }
    });
});