import './App.css';
import { useDropzone } from 'react-dropzone';
import React, { useCallback, useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrText, setOcrText] = useState(''); // New state to store OCR output

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      console.log("No File was inputted!");
      return;
    }
    setSelectedFile(acceptedFiles[0]); // Set the first file as selected
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log("No file to upload");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://computervision-fk6z.onrender.com/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOcrText(response.data.extracted_text); // Update OCR output with the response
    } catch (error) {
      console.error('Error uploading file:', error);
      setOcrText('Error processing the file.'); // Display error message
    }
  };

  const handleDelete = () => {
    setSelectedFile(null); // Clear the selected file
    setOcrText(''); // Clear OCR output
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div className="header">
        Online Image Character Recognition Tool
      </div>

      <div className="flex">
        <div {...getRootProps()} className="flex-row-1">
          <input {...getInputProps()} accept=".jpeg, .jpg, .png, .exr" />
          {isDragActive ? (
            <p>Drop Your File Here!</p>
          ) : (
            <p>Drag & Drop Your File Here or Select A File Here!</p>
          )}

          <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 900 }}>
            <h4>Selected File:</h4>
            {selectedFile ? (
              <p>{selectedFile.name} - {selectedFile.size} bytes</p>
            ) : (
              <p>No file selected.</p>
            )}
          </div>
        </div>

        <div className="flex-row-2">
          <h4>OCR Output:</h4>
          <p>{ocrText || 'No OCR output yet.'}</p> {/* Display OCR output here */}
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleUpload} disabled={!selectedFile} className="button1">
          Submit File
        </button>
        <button onClick={handleDelete} disabled={!selectedFile} className="button2">
          Delete File
        </button>
      </div>

      <div className="footer">
        <a href="https://github.com/Hoksolinvan" target="_blank" rel="noopener noreferrer">
          <img className="logo" src="/github-mark.png" style={{ width: '50px', height: '50px' }} alt="GitHub Logo" />
        </a>
      </div>
    </>
  );
}

export default App;
