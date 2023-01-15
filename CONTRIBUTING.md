# Development Rules

The rules to contribute to the AREA project are described below.
Please follow the indicated rules to contribute in the most efficient way !

## Issue Rules

When creating an issue, choose an available template and follow the given format :

* The name of the issue must have an action verb and a title <br>
`Create the Contributing.md`

* Describing the issue is mandatory and usefull for everyone. Try to be concise with the features which will be added on the project.

* Add a label to clarify the issue. If there is no label existing or corresponding to your issue, create one and describe it.

* Take a moment to link the issue with the project, if it hasn't been done automatically.

* If possible, assign it to someone.

* If necessary, attach it to a milestone.

* If needed, specify a due date.

## Branch Rules

The branch name should consider the issue title and the issue number in its name. The issue's number must come first.

Example:

```bash
    git checkout -b 2-Create-The-Contributing.md
```

You must make one branch per issue.

Try to push as regularly as possible so everyone can see where you are at.
When first committing on a branch, it is recommended to open a PR draft, so it will be easier for your mates to see where you are at.

## Coding Style

For the coding style, there are some rules you need to follow:

* Everybody working on the project with you must be able to understand on what you are working within minutes. If you can split a function in two, you must do it !

* To have the same code format, your code must respect the given Clang format.

## Documentation Rules

For the Node.js part, we use JSDoc 3 for documentation, and in order to allow the proper deployment of the documentation, please respect the JSDoc format. <br>
If you have a doubt about the format, you can click [here](https://jsdoc.app/howto-commonjs-modules.html).

For the Flutter part, precisions will be added later.

Any undocumented elements will lead to the refusal of the PR.

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

## Testing Rules

**This part will be completed later when the tests will be set up.**

When something can be verified by a test, we will be looking for tests in your PR.

The lack of test in your code can be one of the reasons of refusing a PR.

## Pull Request Rules

### The author

When your work is done on a branch, you must make a pull request.

The name is the same for the branch.
However, you must write a description as a reminder of what you have done.
It may be all about the issue, but often you have unexpected fixes.
It must follow the following template :

```md
# Purpose:
The purpose of this pull request is to add the service John.

## Added features:
- This service has been added to the application. It's include:
    - A action which is used to ...
    - A reaction which does this ...

## Updated features:
- This part has been changed because the new feature needed to be implemented this way.

## Fixed features:
- This features has been fixed.
- This one too.

## Removed features:
- This features has been removed because it was unnecessary.
```

Of course, if a section is empty, it can be removed from the description.

### The reviewers

For the reviewers, prioritize the people who can really help you with your work.

A reviewer must read, understand and test

You must have at least 2 reviewers who approve your pull request.

Try not to exceed 24 hours before reading your PRs.

It is obviously forbidden to approve a merge until all the reviewers have accepted the PR as well as the success of the workflows.
