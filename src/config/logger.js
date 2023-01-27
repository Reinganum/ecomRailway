const pino=require('pino')
const parseArgs = require('minimist');
const options={
    alias:{
        p:'port',
        l:'prod' // logger: production or development
    } 
}
const arg=parseArgs(process.argv.slice(2),options);
const mode=arg.l;

function buildProdLogger() {
  // registro de nivel warn a warn.log
    const prodLogger = pino('warn.log')
    prodLogger.level = 'warn'
    return prodLogger
  }

function buildDevLogger() {
  // registrar todo por consola
    const devLogger = pino()
    devLogger.level = 'info'
    return devLogger
  }

  let logger = null

  if (mode === 'prod') {
    logger = buildProdLogger()
    console.log("inicializado con logger de produccion")
  } else {
    logger = buildDevLogger()
    console.log("inicializado con logger de desarrollo")
  }
  
module.exports=logger