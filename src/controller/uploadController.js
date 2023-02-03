const multer = require('multer')

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        const filename = `${file.originalname}`
        cb(null, filename);
    }
})

const uploadStorage = multer({ storage: myStorage })
const upload=uploadStorage.single('myFile')

module.exports=upload

