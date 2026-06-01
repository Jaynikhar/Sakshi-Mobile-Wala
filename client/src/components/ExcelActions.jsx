import { useState, useEffect } from "react";
import { getUploadedFiles, importExcel, exportExcel, deleteFile, downloadFile } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ExcelActions() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]); 
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data } = await getUploadedFiles();
      setFiles(data);
    } catch (err) {
      console.log(err);
    }
  };

  const role =
    user?.role ||
    user?.user?.role ||
    user?.data?.role;

  const isAuthor = role?.toLowerCase() === "author";

  // IMPORT
  const handleImport = async () => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await importExcel(formData);
      alert("Excel Imported ✅");
    } catch (err) {
      console.log(err);
      alert("Import failed ❌");
    }
  };

  // EXPORT
  const handleExport = async () => {
    try {
      const res = await exportExcel();

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = "devices.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await deleteFile(filename);
      alert("Deleted ✅");
      fetchFiles(); // refresh list
    } catch (err) {
      console.log(err);
      alert("Delete failed ❌");
    }
  };

  const handleDownload = async (filename) => {
    try {
      const res = await downloadFile(filename);

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url); // ✅ CLEANUP

    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // ONLY AUTHOR CAN SEE
  if (!isAuthor) return null;

  return (
    <>
      <div className="flex gap-4 mb-6">
      
        {/* IMPORT */}
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />


        <button
          onClick={handleImport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Import Excel
        </button>

        {/* EXPORT */}
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export Full Excel
        </button>
        
      </div>
      <div className="mt-6">
        <h2 className="font-bold mb-2">Uploaded Files</h2>

        {files.length === 0 ? (
          <p>No files found</p>
        ) : (
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded"
              >
                {/* ✅ CLICK TO DOWNLOAD */}
                <span>
                  {f}
                </span>

                <button
                  onClick={()=>handleDownload(f)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Download Excel
                </button>
                        
                <button
                  onClick={() => handleDelete(f)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}