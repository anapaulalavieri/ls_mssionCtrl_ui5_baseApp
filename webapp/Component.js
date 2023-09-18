sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
    "scm/ctc/dashboard/scmctcdashboard/model/models",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/IconPool"
], function (UIComponent, Device, models,HashChanger,JSONModel,IconPool) {
	"use strict";

	return UIComponent.extend("scm.ctc.dashboard.scmctcdashboard.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
            // HashChanger.getInstance().replaceHash("");
            // enable routing
              var accentureImg = jQuery.sap.getModulePath("scm.ctc.dashboard.scmctcdashboard") + "/model/AccentureIcon.png";
        //    this.getModel("oGlobalModel").setProperty("/accentureImg", accentureImg);
        var b = [];
        var c = {};
        //Fiori Theme font family and URI
        var t = {
            fontFamily: "SAP-icons-TNT",
            fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
        };
        //Registering to the icon pool
        IconPool.registerFont(t);
        b.push(IconPool.fontLoaded("SAP-icons-TNT"));
        c["SAP-icons-TNT"] = t;
        //SAP Business Suite Theme font family and URI
        var B = {
            fontFamily: "BusinessSuiteInAppSymbols",
            fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
        };
        //Registering to the icon pool
        IconPool.registerFont(B);
        b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
        c["BusinessSuiteInAppSymbols"] = B;
        jQuery.sap.setIcons({
                favicon: "icon/favicon.ico"
            });    
        this.getRouter().initialize();

			// set the device model
            this.setModel(models.createDeviceModel(), "device");
		}
	});
});
