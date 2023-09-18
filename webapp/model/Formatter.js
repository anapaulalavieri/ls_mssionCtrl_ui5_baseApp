sap.ui.define([], function () {
    "use strict";
    return {
        float2Decimal: function (sValue) {
            if (sValue) {
                var formattedValue = parseFloat(sValue * 100).toFixed(1);
                return parseInt(formattedValue) >= 100 ? parseInt(formattedValue) : parseFloat(sValue * 100) < 1 ? "00.0" : formattedValue

            }
            else {
                return "00.0";
            }
        },

        legendColorMachine: function (sExpline) {
            if (sExpline) {
                if(sExpline === "Machine 1" || sExpline === "Machine 5" || sExpline === "Machine 9" ||
                sExpline === "Machine 11" ||sExpline === "Machine 12" ||sExpline === "Machine 16" ||sExpline === "Machine 20" ||sExpline === "Machine 22" ||sExpline === "Machine 23" ||sExpline === "Machine 27" ||sExpline === "Machine 31" ||sExpline === "Machine 33") {
                    return '#3ABEF0';
                }
                if(sExpline === "Machine 2" ||sExpline === "Machine 6" ||sExpline === "Machine 17" ||sExpline === "Machine 28" ||sExpline === "Machine 13" ||sExpline === "Machine 24") {
                    return '#8379F7';
                }
                if(sExpline === "Machine 3" ||sExpline === "Machine 7" ||sExpline === "Machine 14" ||sExpline === "Machine 18" ||sExpline === "Machine 25" ||sExpline === "Machine 29") {
                    return '#A100FF';
                }
               
            }
            return "#FFF";
        },

        legendColour: function (sExpline) {

            if (sExpline) {
                if (sExpline === "FG126") {
                    return '#3ABEF0';
                }
                if (sExpline === "IBP-100") {
                    return '#8379F7';
                }
                if (sExpline === "IBP-110") {
                    return '#A100FF';
                }
                if (sExpline === "IBP-120") {
                    return '#F5BC51';
                }
            }
              return "#FFF";

        },

         lineChartResponsiveWidth : function (){
            var oDevice = this.getModel("device").getData();
            if(oDevice.system.tablet){
               if(oDevice.resize.width === 1024 && oDevice.resize.height === 1366){
                   return '200px'
               }
               if(oDevice.resize.width === 1366 && oDevice.resize.height === 1024){
                   return '260px'
               }
               if(oDevice.resize.width === 1024 && oDevice.resize.height === 768){
                   return '200px'
               }
               if(oDevice.resize.width === 768 && oDevice.resize.height === 1024){
                   return '130px'
               }
               
            }
            if(oDevice.system.desktop){
               return '16rem'
            }

         },
        

        bottleneckVisible: function (sValue) {
            if (sValue) {
                return parseFloat(sValue * 100) > 85 ? false : true;
            }
            return false;
        },
        parseIntFormat: function (sValue) {
            if (sValue) {
                return parseInt(sValue);
            } else {
                return parseInt("00.0");
            }
        },
        convertToBillion: function (sValue) {
            if (sValue) {
                return (sValue / 1000000).toFixed(1)
            }
        },
        Billion: function (sValue) {
            if (sValue) {
                var val= parseFloat(sValue / 1000000)
                var sString=val.toString().slice(0,3)
                var finalFloat = parseFloat(sString)
                if(sValue< 1000000){
                   sString=val.toString().slice(0,5)
                    finalFloat = parseFloat(sString) 
                }
                return finalFloat
            }
        },
        Month: function(sValue){
            if(sValue){
                var month=sValue.substring(0,3)
                return month;
            }

        },
        parseIntPercent: function (sValue) {
            if (sValue) {
                return sValue * 100;
            } else {
                return parseInt("00.0") / 100;
            }
        },
        statusColor: function(sValue){
            var formattedValue = parseFloat(sValue * 100).toFixed(1);
            if(formattedValue>=80 && formattedValue<90){
                return "Warning";
            } 
            if(formattedValue<80) {
                return "Error";
            } else{
                return "None";
            }
        },
        statusColorPlant: function(sValue){
            var formattedValue = parseFloat(sValue * 100).toFixed(1);
            if(formattedValue>=80 && formattedValue<90){
                return "Critical";
            } 
            if(formattedValue<80) {
                return "Error";
            } else{
                return "Good";
            }
        },
        floatValueCMC: function (sValue) {
            if (sValue) {
                var formattedValue = parseFloat(sValue * 100);
                return formattedValue;
            }
            
        }
    }
});