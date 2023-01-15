# A = L² (AREA)

## Project Overview

The goal of this project is to create a business application that allows users to discover and utilize the software platform of their choice through the implementation of a software suite similar to that of IFTTT and/or Zapier. The software suite will be broken down into three parts: an application server to implement all the features listed, a web client to use the application from a browser, and a mobile client to use the application from a phone.

## Functionality

The application will offer the following functionalities:

- User registration and account creation
- User authentication and identification
- User subscription to different services
- Each service will offer action and reaction components for the user to interconnect and create custom automated workflows (referred to as AREA)
- The application will have triggers to automatically execute the created AREA

The application server will only be used for the web and mobile clients, which will have to expose all of its functionalities through a REST API.

## User Management

The application is centered on the digital life of users, so it must offer a management module for them. The client will ask non-identified users to register via an online form. A request will be made to the application server to validate this account creation step. An administration section will be useful to manage site users.

## Authentication/Identification

The application requires users to be authenticated in order to use it. The following options will be implemented:

- Authentication via username/password where the client transmits the request to the application server for processing
- Identification via OAuth2 (eg. Yammer, Twitter, Facebook, etc.) where the client processes the identification and notifies the application server if successful

## Services

The purpose of the application is to interconnect different services (Outlook 365, Yammer, OneDrive, Twitter, etc.) between them. Users will be able to subscribe to these services and link their accounts (eg. from their profile page, the user links their Twitter/Google account via an OAuth2 authentication). The application will then allow the user to create custom automated workflows between these services.
