import './App.css';
import FileInput from './FileInput/FileInput';
import {useDropzone} from 'react-dropzone'
import React, {useCallback} from 'react';



function App() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])



  const {getRootProps, getInputProps, acceptedFiles, isDragActive} = useDropzone({onDrop})

  return (
    <>
    

    <div className="header">
      Online Image Character Recognition Tool
    </div>
    
    <div className="flex">

    <div {...getRootProps()} className="flex-row-1">
      <input {...getInputProps()}/>
      {
        isDragActive ?
        <p>Drop Your File Here!</p> :
        <p>Drag & Drop Your File Here or Select A File Here!</p>

      }
      <div style={{fontFamily:'monospace', fontSize:'16px', fontWeight:900}}>
        <h4>Files:</h4>
        {acceptedFiles.length > 0 ? (
          <ul>
            {acceptedFiles.map((file) => (
              <li key={file.path}>{file.path.substring(2,)} - {file.size} bytes</li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>

      
</div>

<div className="flex-row-2">
OCR Output
</div>


      
    </div>



   
    <div className="footer" >
    <a href="https://github.com/Hoksolinvan" target="_blank" ><img className="logo" src="/github-mark.png" style={{width:'50px', height:'50px' }} /> </a>
    </div>
    </>
  );
}

export default App;
