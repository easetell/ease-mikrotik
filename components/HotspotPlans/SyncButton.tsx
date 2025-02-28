import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SyncButton: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = async () => {
    setIsSyncing(true);
    try {
      const response = await axios.post("/api/sync-hotspot-plans");
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to synchronize plans");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      className="rounded-lg bg-green-500 px-5 py-2 text-sm font-medium text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
      type="button"
      onClick={handleSyncClick}
      disabled={isSyncing}
    >
      {isSyncing ? "Syncing..." : "Sync Plans with MikroTik"}
    </button>
  );
};

export default SyncButton;
