import { useEffect, useState } from "react";
import { getUsers, updateRole } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ExcelActions from "../components/ExcelActions";
export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const role =
    user?.role ||
    user?.user?.role ||
    user?.data?.role;

  const isAuthor = role?.toLowerCase() === "author";

  useEffect(() => {
    if (isAuthor) fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (err) {
      console.log(err);
      alert("Not authorized");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateRole(id, newRole);
      fetchUsers();
    } catch (err) {
      console.log(err);
      alert("Error updating role");
    }
  };

  if (!isAuthor) {
    return (
      <h1 className="text-center mt-10 text-red-500">
        Access Denied
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Author Dashboard
        </h1>

        <ExcelActions />
        <div className="space-y-4">
          <h2 className="font-bold mt-4 mb-2">Users</h2>
          {users.map((u) => (
            <div
              key={u._id}
              className="flex justify-between items-center p-4 rounded bg-gray-50 dark:bg-gray-700"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {u.name}
                </p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>

              <select
                value={u.role}
                onChange={(e) =>
                  handleRoleChange(u._id, e.target.value)
                }
                className="p-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="author">Author</option>
              </select>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}