const multer = require('multer')
const storage = multer.memoryStorage()

//middleware
const upload = multer({
    storage: storage
})

module.exports = {upload}