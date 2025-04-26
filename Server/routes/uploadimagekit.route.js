import express from 'express';
import multer from 'multer';  
import imagekit from '../config/imagekit.config.js'; 



const uploadRouter = express.Router();

// Multer setup: In-memory storage for file upload (no need for temp files on the server)
const upload = multer({ storage: multer.memoryStorage() });

// Function to sanitize file name to avoid invalid characters
const sanitizeFileName = (filename) => {
  return filename.replace(/[.#$[\]]/g, '_').replace(/\s+/g, '_'); // Replaces invalid chars and spaces
};

uploadRouter.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const { originalname, buffer } = req.file;
  const sanitizedFileName = sanitizeFileName(originalname); // Sanitize the file name to avoid invalid characters

  try {
    // Upload to ImageKit using the Node.js SDK
    const uploadResponse = await imagekit.upload({
      file: buffer, // The file buffer
      fileName: sanitizedFileName, // The file name
      folder: '/pdfs/', // Optional folder
      isPrivateFile: false, // Set to true if the file should be private
    });

    console.log('File uploaded to ImageKit:', uploadResponse);

    // Send back the ImageKit URL of the uploaded file
    res.json({
      message: 'PDF uploaded successfully',
      data: {
        url: uploadResponse.url,  // ImageKit URL of the uploaded file
        name: uploadResponse.name,
      },
    });
  } catch (error) {
    console.error('Error uploading PDF to ImageKit:', error);
    res.status(500).send('Error uploading PDF');
  }
});

export default uploadRouter;
