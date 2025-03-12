import multer from "multer";
import path from "path";

// Konfigurasi tempat penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");  
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); 
    }
});

// Filter jenis file
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("File harus berupa gambar!"), false);
    }
};

export const upload = multer({ storage, fileFilter });