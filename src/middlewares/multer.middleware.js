import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    // Giving unique filename for our storage
    filename: function (req, file, cb) {
        // Keeping custom filename instead of
        // file.originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer(
    {
        storage,
    }
)  // object with storegae method