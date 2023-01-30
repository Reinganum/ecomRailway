const cluster=require('cluster')
const args = require('./argsConfig');
const logger = require('./logger');
const cpus=require('os').cpus()
const PORT=args.p||process.env.PORT||8080;

// CORRER SERVIDOR EN CLUSTER O UN NUCLEO

const runServer=(app,args)=>{
    if(args?.m!=='cluster'){
    app.listen(PORT,()=>{
        logger.info("server running in one core")
        logger.info(`SERVIDOR ON ${PORT} - PID ${process.pid} `)
    })
} else {
    logger.info("server running in cluster mode")
    if(cluster.isPrimary){
        const lengthCpu=cpus.length
        for (let index = 0; index < lengthCpu; index++) {
            cluster.fork()
        }
    }else{
        app.listen(PORT,()=>{
            logger.info(`SERVER RUNNING ON ${PORT} - PID ${process.pid} `)
        })
    }
}}

module.exports=runServer



