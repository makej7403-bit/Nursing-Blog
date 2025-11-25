// pages/upload.js
import UploadForm from "../components/UploadForm";
import FileList from "../components/FileList";

export default function UploadPage({ user }) {
  return (
    <div>
      <h1>Upload</h1>
      {!user ? (
        <p>Please log in or sign up to upload files.</p>
      ) : (
        <>
          <UploadForm />
        </>
      )}

      <hr />
      <h2>All files</h2>
      <FileList />
    </div>
  );
}
