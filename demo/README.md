# SPARQL Blockly demo app

**[Try it online](https://langsamu.github.io/sparql-blockly/)**

### Run locally

```batch
npm install
npm run build
npm start
```

and navigate to [localhost:8080](http://localhost:8080/)

The build writes `app.js` into the [public folder](public), which `npm start` serves.
Static assets are in the same folder.

The `pages.yml` workflow builds and deploys the demo to GitHub Pages on pushes to `main`.
