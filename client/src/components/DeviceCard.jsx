import { useNavigate } from "react-router-dom";

const DeviceCard = ({ device }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 border rounded cursor-pointer hover:bg-gray-100"
      onClick={() => navigate(`/device/${device._id}`)}
    >
      <h2 className="text-lg font-bold">{device.name}</h2>
    </div>
  );
};

export default DeviceCard;