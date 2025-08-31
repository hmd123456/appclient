import React, { useState } from 'react';

function FileUploadForm({ initialFiles, onSubmit, onBack, user }) {
  const [files, setFiles] = useState(initialFiles || {});

  const handleFileChange = e => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    onSubmit(files);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Upload Documents</h3>
      <label>
        Resume:
        <input type="file" name="resume" onChange={handleFileChange} required />
      </label>
      <label>
        Photo:
        <input type="file" name="photo" onChange={handleFileChange} required />
      </label>
      <button type="button" onClick={onBack}>Back</button>
      <button type="submit">Submit</button>
    </form>
  );
}

export default FileUploadForm;