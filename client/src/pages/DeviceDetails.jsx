import { useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDeviceById,
  deleteDevice,
  updateDevice,
  deleteField,
} from "../services/deviceService";
import { useAuth } from "../context/AuthContext";


const DeviceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [device, setDevice] = useState(null);
  const [editData, setEditData] = useState({}); // ✅ FIXED
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    fetchDevice();
  }, []);


  useEffect(() => {
    if (user) {
      const detectedRole =
        user.role ||
        user.user?.role ||
        user.data?.role ||
        null;

      setRole(detectedRole);
      console.log("ROLE DETECTED:", detectedRole);
    }

  }, [user]);

  const fetchDevice = async () => {
    try {
      setLoading(true);
      const data = await getDeviceById(id);
      setDevice(data);
      setEditData(data.fields || {}); // ✅ sync fields
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // const isEditor = ["author", "editor"].includes(
  //   user?.role || user?.user?.role
  // );
  // const isEditor = true;
  const isEditor = ["author", "editor"].includes(
    role?.toLowerCase()
  );

  // 🔴 DELETE DEVICE
  const handleDeleteDevice = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDevice(id, user.token);
      // alert("Device deleted");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // 🟢 UPDATE DEVICE
  const handleUpdateDevice = async () => {
    try {
      await updateDevice(
        id,
        { fields: editData }, // ✅ correct payload
        user.token
      );
      alert("Updated Successfully");
      fetchDevice();
    } catch (err) {
      console.log(err);
    }
  };

  // ✏️ HANDLE INPUT CHANGE
  const handleFieldChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // ❌ DELETE FIELD (FRONTEND + BACKEND)
  const handleDeleteField = async (field) => {
    try {
      // backend delete
      await deleteField(id, field, user.token);

      // frontend update
      const updated = { ...editData };
      delete updated[field];
      setEditData(updated);

      // alert("Field deleted");
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddField = async () => {
    if (!newKey || !newValue) return;

    try {
      const updatedFields = {
        ...editData,
        [newKey]: newValue,
      };

      await updateDevice(
        id,
        { fields: updatedFields },
        user.token
      );

      setEditData(updatedFields);
      setNewKey("");
      setNewValue("");

      // alert("Field added");
    } catch (err) {
      console.log(err);
    }
  };


  if (!user) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">Loading user...</div>;
  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6"><h1>Loading devices...</h1></div>;
  if (!device) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6"><h1>Add Devices</h1></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {device.name}
        </h1>

        {/* IMAGE */}
        {device.image && (
          <img
            src={device.image}
            alt={device.name}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
        )}

        
        {/* FIELDS */}
        <div className="space-y-3">
          {Object.keys(editData).map((key) => (
            <div key={key}>
              <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                {key}
              </label>

              <input
                type="text"
                name={key}
                value={editData[key]}
                onChange={handleFieldChange}
                disabled={!isEditor}
                className="border p-2 w-full rounded
                          bg-white dark:bg-gray-700
                          text-black dark:text-white
                          placeholder-gray-400
                          disabled:opacity-70"
              />

              

              {isEditor && (
                <button
                  onClick={() => handleDeleteField(key)}
                  className="text-red-500 text-sm mt-1 hover:text-red-700"
                >
                  Delete Field
                </button>
              )}
            </div>
          ))}
        </div>

        {isEditor && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Field (e.g RAM)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="border p-2 rounded w-1/2
                        bg-white dark:bg-gray-700
                        text-black dark:text-white"
            />

            <input
              type="text"
              placeholder="Value (e.g 8GB)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="border p-2 rounded w-1/2
                        bg-white dark:bg-gray-700
                        text-black dark:text-white"
            />

            <button
              onClick={handleAddField}
              className="bg-green-500 hover:bg-green-600 text-white px-3 rounded"
            >
              Add
            </button>
          </div>
        )}

        {/* ACTION BUTTONS */}
        {isEditor && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleUpdateDevice}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Device
            </button>

            <button
              onClick={handleDeleteDevice}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Device
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DeviceDetails;