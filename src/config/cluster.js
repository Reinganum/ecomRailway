const cluster=require('cluster')
const args = require('./argsConfig')
const cpus=require('os').cpus()
const PORT=args.p||process.env.PORT||8080;

// CORRER SERVIDOR EN CLUSTER O UN NUCLEO

const runServer=(app,args)=>{
    if(args?.m!=='cluster'){
    app.listen(PORT,()=>{
        console.log("servidor en un nucleo")
        console.log(`SERVIDOR ON ${PORT} - PID ${process.pid} `)
    })
} else {
    console.log("servidor inicializado en modo CLUSTER")
    if(cluster.isPrimary){
        const lengthCpu=cpus.length
        for (let index = 0; index < lengthCpu; index++) {
            cluster.fork()
        }
    }else{
        app.listen(PORT,()=>{
            console.log(`SERVIDOR ON ${PORT} - PID ${process.pid} `)
        })
    }
}}

module.exports=runServer



