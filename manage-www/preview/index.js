const { run } = require('runjs');
const chalk = require('chalk');
const config = require('../vue.config.js');
const rawArgv = process.argv.slice(2);
const args = rawArgv.join(' ');

const preview = rawArgv.includes('--preview');
const report = rawArgv.includes('--report');

run(`vue-cli-service build ${args}`);

const port = 9528;
const publicPath = config.publicPath;

let connect = require('connect');
let serveStatic = require('serve-static');
const app = connect();

app.use(
  publicPath,
  serveStatic('./dist', {
    index: ['index.html', '/']
  })
);

app.listen(port, function () {
  if (preview) {
    console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`));
  }
  if (report) {
    console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`));
  }
});
