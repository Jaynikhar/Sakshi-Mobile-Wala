import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AddDevice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [fields, setFields] = useState({});
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const token = user?.token;

  // ✅ ROLE CHECK
  const role =
    user?.role ||
    user?.user?.role ||
    user?.data?.role;

  const isEditor = ["author", "editor"].includes(
    role?.toLowerCase()
    );

  // ➕ ADD FIELD
  const addField = () => {
    if (!fieldKey || !fieldValue) return;

    setFields({
      ...fields,
      [fieldKey]: fieldValue,
    });

    setFieldKey("");
    setFieldValue("");

  };

  // ❌ REMOVE FIELD
  const removeField = (key) => {
    const updated = { ...fields };
    delete updated[key];
    setFields(updated);
  };

  // 🚀 SUBMIT DEVICE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/devices",
        { name, fields },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Device added successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Error adding device");
    }
  };

  // ❌ BLOCK VIEWER
  if (!isEditor) {
    return ( <><h1 className="text-center mt-10 text-red-500">
      You are not allowed to add devices </h1>
      <h1 className="text-center mt-10 text-red-500">
      Please Login</h1></>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6">

          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Add Device
          </h1>

          <form onSubmit={handleSubmit}>

            {/* DEVICE NAME */}
            <input
              type="text"
              placeholder="Device Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full mb-4 rounded 
                        bg-white dark:bg-gray-700 
                        text-black dark:text-white 
                        placeholder-gray-400"
              required
            />

            {/* ADD FIELD */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Field (e.g RAM)"
                value={fieldKey}
                onChange={(e) => setFieldKey(e.target.value)}
                className="border p-2 w-1/2 rounded 
                          bg-white dark:bg-gray-700 
                          text-black dark:text-white 
                          placeholder-gray-400"
              />

              <input
                type="text"
                placeholder="Value (e.g 8GB)"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className="border p-2 w-1/2 rounded 
                          bg-white dark:bg-gray-700 
                          text-black dark:text-white 
                          placeholder-gray-400"
              />

              <button
                type="button"
                onClick={addField}
                className="bg-green-500 hover:bg-green-600 text-white px-3 rounded"
              >
                Add
              </button>
            </div>

            {/* FIELD LIST */}
            {Object.keys(fields).map((key) => (
              <div
                key={key}
                className="flex justify-between items-center border p-2 mb-2 rounded
                          bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
              >
                <span>
                  {key}: {fields[key]}
                </span>

                <button
                  type="button"
                  onClick={() => removeField(key)}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </div>
            ))}

            {/* SUBMIT */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded w-full">
              Create Device
            </button>

          </form>
        </div>
      </div>
    </>
  );

  // return ( 
  //   <>
  //     <div className="p-5 max-w-xl mx-auto"> 
  //       <h1 className="text-2xl font-bold mb-5">Add Device </h1>
  //       <form onSubmit={handleSubmit}>
  //         {/* DEVICE NAME */}
  //         <input
  //           type="text"
  //           placeholder="Device Name"
  //           value={name}
  //           onChange={(e) => setName(e.target.value)}
  //           className="border p-2 w-full mb-4"
  //           required
  //         />

  //         {/* ADD FIELD */}
  //         <div className="flex gap-2 mb-4">
  //           <input
  //             type="text"
  //             placeholder="Field (e.g RAM)"
  //             value={fieldKey}
  //             onChange={(e) => setFieldKey(e.target.value)}
  //             className="border p-2 w-1/2"
  //           />

  //           <input
  //             type="text"
  //             placeholder="Value (e.g 8GB)"
  //             value={fieldValue}
  //             onChange={(e) => setFieldValue(e.target.value)}
  //             className="border p-2 w-1/2"
  //           />

  //           <button
  //             type="button"
  //             onClick={addField}
  //             className="bg-green-500 text-white px-3"
  //           >
  //             Add
  //           </button>
  //         </div>

  //         {/* FIELD LIST */}
  //         {Object.keys(fields).map((key) => (
  //           <div
  //             key={key}
  //             className="flex justify-between border p-2 mb-2"
  //           >
  //             <span>
  //               {key}: {fields[key]}
  //             </span>

  //             <button
  //               type="button"
  //               onClick={() => removeField(key)}
  //               className="text-red-500"
  //             >
  //               X
  //             </button>
  //           </div>
  //         ))}

  //         {/* SUBMIT */}
  //         <button className="bg-blue-500 text-white px-4 py-2 mt-4">
  //           Create Device
  //         </button>
  //       </form>
  //     </div>
  //   </>
  // );
};

export default AddDevice;
