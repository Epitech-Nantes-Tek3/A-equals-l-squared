# **A = L² (AREA)**

![Dart](https://img.shields.io/badge/dart-%230175C2.svg?style=for-the-badge&logo=dart&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)</br>
![Flutter](https://img.shields.io/badge/Flutter-%2302569B.svg?style=for-the-badge&logo=Flutter&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)</br>
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

## **Project Overview**

The goal of this project is to create a business application that allows members to discover and utilize the software platform of their choice through the implementation of a software suite similar to that of IFTTT and/or Zapier. The software suite will be broken down into three parts: an application server to implement all the features listed, a web client to use the application from a browser, and a mobile client to use the application from a phone.

## **Functionality**

The application will offer the following functionalities:

- User registration and account creation
- User authentication and identification
- User subscription to different services
- Each service will offer action and reaction components for the user to interconnect and create custom automated workflows (referred to as AREA)
- The application will have triggers to automatically execute the created AREA

The application server will only be used for the web and mobile clients, which will have to expose all of its functionalities through a REST API.

## **User Management**

The application is centered on the digital life of users, so it must offer a management module for them. The client will ask non-identified users to register via an online form. A request will be made to the application server to validate this account creation step. An administration section will be useful to manage site users.

## **Authentication/Identification**

The application requires users to be authenticated in order to use it. The following options will be implemented:

- Authentication via username/password where the client transmits the request to the application server for processing
- Identification via OAuth2 (eg. Yammer, Twitter, Facebook, etc.) where the client processes the identification and notifies the application server if successful

## **Services**

The purpose of the application is to interconnect different services (Outlook 365, Yammer, OneDrive, Twitter, etc.) between them. Users will be able to subscribe to these services and link their accounts (eg. from their profile page, the user links their Twitter/Google account via an OAuth2 authentication). The application will then allow the user to create custom automated workflows between these services.

## **Documentation**

You can find the code documentation here :

- [Notion](https://www.notion.so/a-l2-area/Engineering-Wiki-fecd99eca7db4a2d80a88aabe125da1d)
- [Prisma](https://epitech-nantes-tek3.github.io/A-equals-l-squared/prisma/)
- [Flutter](https://epitech-nantes-tek3.github.io/A-equals-l-squared/flutter/)
- [Node.js](https://epitech-nantes-tek3.github.io/A-equals-l-squared/js/)
- [API](https://epitech-nantes-tek3.github.io/A-equals-l-squared/swagger/)

An additional Youtube video containing all our bonuses is available here :

- [Youtube](https://www.youtube.com/watch?v=qXRgzpx2Xk4)

## **Thank for reading**

Feel free to read the `CONTRIBUTING.md`.

Do not hesitate to contact any member for any questions or remarks. You can click on each following name.

## **Authors**

<table>
    <tbody>
        <tr>
            <td align="center">
                <a href="https://github.com/ZQUEMA/">
                    <img src="https://avatars.githubusercontent.com/u/56249749?s=96&v=4" width="100px;" alt="ZQUEMA"/><br/>
                    <sub><b>Quentin Camilleri</b></sub>
                </a><br/>
            </td>
            <td align="center">
                <a href="https://github.com/TomDUVAL-MAHE">
                    <img src="https://avatars.githubusercontent.com/u/72017980?v=4" width="100px;" alt="Tom Duval-Mahe"/><br/>
                    <sub><b>Tom Duval-Mahe</b></sub>
                </a><br/>
            </td>
            <td align="center">
                <a href="https://github.com/GuyomT">
                    <img src="https://avatars.githubusercontent.com/u/71885064?v=4" width="100px;" alt="osvegn"/><br/>
                    <sub><b>Guillaume Terriere</b></sub>
                </a><br/>
            </td>
            <td align="center">
                <a href="https://github.com/tbellicha">
                    <img src="https://avatars.githubusercontent.com/u/72006230?v=4" width="100px;" alt="31Nathan"/><br/>
                    <sub><b>Tanguy Bellicha</b></sub>
                </a><br/>
            </td>
            <td align="center">
                <a href="https://github.com/LucasTesnier/">
                    <img src="https://avatars.githubusercontent.com/u/72015360?v=4" width="100px;" alt="LucasTesnier"/><br/>
                    <sub><b>Lucas Tesnier</b></sub>
                </a><br/>
            </td>
        </tr>
    </tbody>
</table>
