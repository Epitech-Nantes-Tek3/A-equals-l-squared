# Development Rules

The rules to contribute to the AREA project are described below.
Please follow the indicated rules to contribute in the most efficient way !

## Issues

When creating an issue, choose an available template and follow the given format :

* The name of the issue must have an action verb and a title <br>
`Create the Contributing.md`

* Describing the issue is mandatory and usefull for everyone. Try to be concise with the features which will be added on the project.

* Add a label to clarify the issue. If there is no label existing or corresponding to your issue, create one and describe it.

* Take a moment to link the issue with the project, if it hasn't been done automatically.

* If possible, assign it to someone.

* If necessary, attach it to a milestone.

* If needed, specify a due date.

## Branchs

The branch name should consider the issue title and the issue number in its name. The issue's number must come first.

Example:

```bash
    git checkout -b 2-Create-The-Contributing.md
```

You must make one branch per issue.

Try to push as regularly as possible so everyone can see where you are at.
When first committing on a branch, it is recommended to open a PR draft, so it will be easier for your mates to see where you are at.

## Coding Style

Everybody working on the project with you must be able to understand on what you are working within minutes. </br>
There are some rules you need to follow:

### Node.JS

* It is recommended to use a format provided by the `numso.prettier-standard-vscode` extension for VsCode.
* Remember to disable the default formatter in VsCode or set the extension's formatter as the default.

### Flutter

* Flutter has its own formatting and linting system, so it is recommended to use Android Studio to benefit from this. Use the shortcut `Ctrl + Shift + Alt + L` on Linux and `Ctrl + Alt + L` on Windows to format your code.
* Be aware that the VCS will also check for warnings in your code, so pay attention to the recommendations of the IDE.

### VCS Workflows

* Currently, there is no VCS checking the format of JS code. It is up to you to maintain good formatting practices.
* The format and integrity of your Flutter code are currently checked by the VCS. If there is a problem, the workflow will be rejected.

## Documentation

We are very concerned to documentation, so anything that is not documented will result in the PR being denied. Please check the following rules:

### Node.JS

* We use JSDoc 3 for documentation, and in order to allow the proper deployment of the documentation, please respect the JSDoc format. If you have a doubt about the format, you can click [here](https://jsdoc.app/howto-commonjs-modules.html).
* For automatically generating documentation for your functions, use the `crystal-spider.jsdoc-generator` extension for VsCode. Simply type `/**` and press enter to generate the documentation pattern.
* An example of documentation can be found in the `server_app.js` file for the `doc_example` function.

### Flutter

* Unfortunately, Flutter documentation is not currently available in GitHub actions. However, you can use the `flutter_documentation.sh` script to generate and publish documentation on your localhost at port 8080. Be aware that if your project is still running, there may be a conflict with ports.
* For Flutter documentation, you can use any format, as it is automated. However, try to follow best practices as outlined in the [Dart documentation](https://dart.dev/guides/language/effective-dart/documentation).

### VCS Workflow

* A workflow that deploys documentation to GhPage is run on every `main` modification. You can find the documentation [here](https://epitech-nantes-tek3.github.io/A-equals-l-squared/).

## Committing Rules

The commits should always look like the following description:

Action Verb (Add, Delete, Fix ...) + Title + Description of what you have done + Related Issue Number

This should look like this:

```bash
    git commit -m "Add new rules to the CONTRIBUTING.md

    Add Committing Rules #2"
```

You should always commit frequently and based on the given exemple.

If possible, please certify your commits (-S).

## Testing Policy

### Node.JS

* The directory `server/tests/` is available for your unit tests with NodeJS. We use the Mocha plugin and everything is automatically managed.
* You can run the tests locally by running the following commands: `npm install` and `npm test`. A template is available in the file `server/tests/server_app_test.js`.

### Flutter

* The directory `application/app_code/test/` is available for your unit and functional tests with Flutter. *As this technology is the best on the market,* you can do integration tests by interacting with widgets (clicking a button, typing text, etc.).
* For each different feature, remember to create a new file in the directory `application/app_code/test/` and use the template provided in the file `application/app_code/test/widget_test.dart`.
* Be sure to add your test function in the main...

### VCS Workflow

* Flutter and NodeJS are now checked by the VCS. Be sure to properly format your test scripts.

### Warnings

When something can be verified by a test, we will be looking for tests in your PR. </br>
The lack of test in your code can be one of the reasons of refusing a PR.

## Pull Request

### The author

When your work is done on a branch, you must make a pull request.

The name is the same for the branch.
However, you must write a description as a reminder of what you have done.
It may be all about the issue, but often you have unexpected fixes.
It must follow the following template :

```md
# Purpose

The purpose of this pull request is to add the service John.

Fixes # (issue)

## Added features

* This service has been added to the application. It's include:
  * A action which is used to ...
  * A reaction which does this ...

## Updated features

* This part has been changed because the new feature needed to be implemented this way.

## Fixed feature

* This features has been fixed.
* This one too.

## Removed features

* This features has been removed because it was unnecessary.
```

Of course, if a section is empty, it can be removed from the description.

### The reviewers

For the reviewers, prioritize the people who can really help you with your work.

A reviewer must read, understand and test

You must have at least 2 reviewers who approve your pull request, including the product owner @ZQUEMA.

Try not to exceed 24 hours before reading your PRs.

It is obviously forbidden to approve a merge until all the reviewers have accepted the PR as well as the success of the workflows.
