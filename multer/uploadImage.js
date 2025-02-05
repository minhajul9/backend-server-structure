import multer from "multer";
import path from "path";

//multer storage initialize
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const { folder } = req.params;
        cb(null, `images/${folder}/`);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});


// upload image
export const upload = multer({

    storage: storage,
})
