# SAP Mission Control Digital Twin

[[_TOC_]]

# Documentation/Readme

We use the Readme file of a project as a central starting point for a developer to onboard himself on that application. We do understand that it's impossible to maintain the entire business and application context for an application in this file. Because of that we have the following recommendations of what a Readme file should contain:

## Description

Liquid Studio created a proof of concept using the services of SAP Cloud Foundry, SAP Destination, SAP Services that are provided by SAP Business Technology Platform, SAP HANA Cloud, 3D animations and 3D models in applications implemented in JavaScript consuming React resources, open source JavaScript front-end library focused on creating user interfaces on web pages. Finally, these applications are consumed in a SAPUI5 application, generating a single application.

This project consists of a supply chain mission control using a multi-site reseller.

## How to run

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following from each app folder:

```
    npm install
    npm run start
```

## How to deploy

-   To deploy both apps to SAP Business Technology Platform make sure that you are logged in at Cloud Foundry and simply run the following from root folder:

```
    npm run build-deploy
```
Obs: To log in to Cloud Foundry, run the following command and enter your BTP credentials:

```
    cf login
```

## Services/APIs

[ls_mssionCtrl_rct_reactApp](https://dev.azure.com/LiquidStudiosBrazil/SAP/_git/ls_mssionCtrl_rct_reactApp)


## Request

N/A

## Reference Application

N/A

## External Related applications/Dependencies

SAP Business Application Services

SAP Business Technology Platform

## API Management - Policies configuration

N/A

## Libraries

- ui5
- sapui5
- openui5

## Contribute

N/A