# Skizzle

Skizzle is a Svelte + Electron application fetch and group the pull requests from all your projects from Azure DevOps. Skizzle notify you when a new pull request is available.

This app uses the [Azure DevOps API](https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-5.1) API, and it is built with [Electron](https://electronjs.org/) and [Svelte](https://svelte.dev).

<p align="center">
  <img src="./docs/screenshot.jpg" alt="Skizzle displays a list of pull requests" />
</p>

## Getting Started

Clone this repository:

```bash
# download
git clone https://github.com/AxaGuilDEv/skizzle.git
cd Skizzle

# install dependencies
npm install

# Run project
npm start
```

### Installing

Installing Skizzle is pretty basic. Just follow the installer.
For logging into the app, you have to use your Azure devOps e-mail and a token. This token have to be created from [Azure](https://dev.azure.com) and must be configured as "All accessible organizations" and the Scopes have to be "full access".

## Contributing

Please read [CONTRIBUTING.md](https://github.com/AxaGuilDEv/skizzle/CONTRIBUTING.md) for details on our [code of conduct](https://github.com/AxaGuilDEv/skizzle/CODE_OF_CONDUCT.md), and the process for submitting pull requests to us.

## Authors

BOUKORRAS Jerome - Software Engineer.
DE BAERDEMAEKER Mathieu - Software Engineer.

## License

This project is licensed under MIT License - see the [LICENSE.md](https://github.com/AxaGuilDEv/Skizzle/LICENSE.md) file for details