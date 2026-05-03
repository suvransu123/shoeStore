// import multer from 'multer';

// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only images are allowed'), false);
//     }
//   },
// });

// export default upload;
import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

// Allowed types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WEBP images are allowed"), false);
    }
  },
});

export default upload;