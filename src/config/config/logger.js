const pino=require('pino')
const args=require('./argsConfig')
const path=require('path')
let logger=null
if (args.l==="prod"){
    console.log("logger initialized in production mode")
    logger=pino(
      {
        level:'error',
      },
      pino.destination(`${__dirname}/../logs/error.log`)
    );
} else {
  console.log("logger initialized in development mode")
  logger=pino(
    {
      level:process.env.PINO_LOG_LEVEL,
    },
  );
}
  
module.exports=logger