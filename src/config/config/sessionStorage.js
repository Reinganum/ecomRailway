const dotenv=require('dotenv').config()
const Mongostore=require('connect-mongo')
const maxAge=Number(process.env.COOKIE_MAX_AGE)

let sessionOptions=null;
if(process.env.SELECTED_DATABASE!=='mongo'&& process.env.AUTH_METHOD!=="JWT"){
    sessionOptions={
        secret:"secret",
        resave:false,
        saveUninitialized:false,
        ttl:process.env.SESSION_TTL,
        cookie : {
            maxAge: maxAge
        }
    }   
} else {
     sessionOptions={
        store:Mongostore.create({
            mongoUrl:process.env.MONGO_URI,
            mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
            dbName:process.env.MONGO_DB_NAME,
            collectionName:'sessions',
        }),
        secret:"secret",
        resave:false,
        saveUninitialized:false,
        cookie : {
            maxAge: maxAge
        }
    }
}

module.exports = sessionOptions;