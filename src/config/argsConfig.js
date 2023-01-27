const parseArgs = require('minimist');
const options={
    alias:{
        p:'port',  // port 
        m:'mode', // fork o cluster
        l:'prod' // logger production
    } 
}

const args=parseArgs(process.argv.slice(2),options)
module.exports=args