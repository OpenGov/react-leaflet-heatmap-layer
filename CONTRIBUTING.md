# Contributing

Things you can do to contribute include:

1. Report a bug by [opening an issue](https://github.com/OpenGov/react-leaflet-heatmap-layer/issues/new)
2. Suggest a change by [opening an issue](https://www.github.com/OpenGov/react-leaflet-heatmap-layer/issues/new)
3. Fork the repository and fix [an open issue](https://github.com/OpenGov/react-leaflet-heatmap-layer/issues)

### Technology

`react-leaflet-heatmap-layer` is a custom layer for the `react-leaflet` package. This package is a convenient wrapper around Leaflet, a mapping library, for React. The source code is written with ES6/ES2015 syntax as well as [FlowType](http://flowtype.org) type annotations.

### Install dependencies

1. Install Node via [nodejs.org](http://nodejs.org)
2. After cloning the repository, run `npm install` in the root of the project

This project is developed with Node version 4.3.0 and NPM 3.3.10.

### Contributing via Github

The entire project can be found [on Github](https://github.com/OpenGov/react-leaflet-heatmap-layer). We use the [fork and pull model](https://help.github.com/articles/using-pull-requests/) to process contributions.

#### Fork the Repository

Before contributing, you'll need to fork the repository:

1. Fork the repository so you have your own copy (`your-username/react-leaflet-heatmap-layer`)
2. Clone the repo locally with `git clone https://github.com/your-username/react-leaflet-heatmap-layer`
3. Move into the cloned repo: `cd react-leaflet-heatmap-layer`
4. Install the project's dependencies: `npm install`

You should also add `OpenGov/react-leaflet-heatmap-layer` as a remote at this point. We generally call this remote branch 'upstream':

```
git remote add upstream https://github.com/OpenGov/react-leaflet-heatmap-layer
```

#### Development

You can work with a live, hot-reloading example of the component by running:

```bash
npm run example
```

And then visiting [localhost:8000](http://localhost:8000).

As you make changes, please describe them in `CHANGELOG.md`.

#### Submitting a Pull Request

Before submitting a Pull Request please ensure you have completed the following tasks:

1. Describe your changes in `CHANGELOG.md`
2. Make sure your copy is up to date: `git pull upstream master`
3. Run `npm run compile`, to compile your changes to the exported `/lib` code.
4. Bump the version in `package.json` as appropriate, see `Versioning` in the section below.
4. Run `npm run lint` to verify code style, all pull requests should have zero lint errors and warnings
4. Commit your changes
5. Push your changes to your fork: `your-username/react-leaflet-heatmap-layer`
6. Open a pull request from your fork to the `upstream` fork (`OpenGov/react-leaflet-heatmap-layer`)

## Versioning

This project follows Semantic Versioning.This means that version numbers are basically formatted like `MAJOR.MINOR.PATCH`.

#### Major

Breaking changes are signified with a new **first** number. For example, moving from 1.0.0 to 2.0.0 implies breaking changes.

#### Minor

New components, new helper classes, or substantial visual changes to existing components and patterns are *minor releases*. These are signified by the second number changing. So from 1.1.2 to 1.2.0 there are minor changes.

#### Patches

The final number signifies patches such as fixing a pattern or component in a certain browser, or fixing an existing bug. Small changes to the documentation site and the tooling around the Calcite-Web library are also considered patches.

## Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I
  have the right to submit it under the open source license
  indicated in the file; or

* (b) The contribution is based upon previous work that, to the best
  of my knowledge, is covered under an appropriate open source
  license and I have the right under that license to submit that
  work with modifications, whether created in whole or in part
  by me, under the same open source license (unless I am
  permitted to submit under a different license), as indicated
  in the file; or

* (c) The contribution was provided directly to me by some other
  person who certified (a), (b) or (c) and I have not modified
  it.

* (d) I understand and agree that this project and the contribution
  are public and that a record of the contribution (including all
  personal information I submit with it, including my sign-off) is
  maintained indefinitely and may be redistributed consistent with
  this project or the open source license(s) involved.
