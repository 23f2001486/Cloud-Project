import multer from "multer";

const upload = multer({ dest: "uploads/" }); // Temp storage
export default upload;
