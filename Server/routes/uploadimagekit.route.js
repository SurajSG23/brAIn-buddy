import express from 'express';
import multer from 'multer';  
import imagekit from '../config/imagekit.config.js'; 

const uploadRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const sanitizeFileName = (filename) => {
  return filename.replace(/[.#$[\]]/g, '_').replace(/\s+/g, '_'); 
};

uploadRouter.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const { originalname, buffer } = req.file;
  const sanitizedFileName = sanitizeFileName(originalname); 

  try {
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: sanitizedFileName, 
      folder: '/pdfs/', 
      isPrivateFile: false, 
    });
    res.json({
      message: 'PDF uploaded successfully',
      data: {
        fileId: uploadResponse.fileId,
        url: uploadResponse.url,  
        name: uploadResponse.name,
      },
    });

  } catch (error) {
    console.error('Error uploading PDF to ImageKit:', error);
    res.status(500).send('Error uploading PDF');
  }
});

export default uploadRouter;
