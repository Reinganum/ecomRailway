const parseArgs = require('minimist');
const options={
    alias:{
        p:'port',  // port 
        m:'mode', // fork or cluster
        l:'prod', // logger or production mode 
        s:'mem' // storage memory o fs
    } 
}

const args=parseArgs(process.argv.slice(2),options)

module.exports=args