import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Button,
  Chip,
  addToast,
} from "@heroui/react";
import { RefreshCwIcon } from "lucide-react";

import api from "../../utils/api";
import useUserStore from "../../context/store";


const statusColorMap = {
  requested: "warning",
  "in-Progress": "primary",
  completed: "success",
  cancelled: "danger",
};

const RideHistoryTable = () => {
  const [empty, setEmpty] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const user = useUserStore((state) => state.user);

  // Set columns based on user type
  React.useEffect(() => {
    if (user.type === "passenger") 
    {
      setColumns([
        { key: "_id", label: "Ride ID" },
        { key: "driver_id", label: "Driver ID" },
        { key: "driver_name", label: "Driver Name" },
        { key: "pickupLocation", label: "Pickup Location" },
        { key: "dropoffLocation", label: "Dropoff Location" },
        { key: "distance", label: "Distance" },
        { key: "fare", label: "Fare" },
        { key: "type", label: "Ride Type" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created At" },
      ]);
    } 
    else if (user.type === "driver") 
    {
      setColumns([
        { key: "_id", label: "Ride ID" },
        { key: "passenger_id", label: "Passenger ID" },
        { key: "passenger_name", label: "Passenger Name" },
        { key: "pickupLocation", label: "Pickup Location" },
        { key: "dropoffLocation", label: "Dropoff Location" },
        { key: "distance", label: "Distance" },
        { key: "fare", label: "Fare" },
        { key: "type", label: "Ride Type" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created At" },
      ]);
    }
  }, [user.type]);

  const fetchRideHistory = async () => {
    console.log("Fetching ride history for user:", user.id);
    setLoading(true);

    if (user.type === "passenger") {
      api.get(`/ride/passengerHistory?passengerId=${user.id}`)
      .then((res) => {
        if (res.data.rides && res.data.rides.length > 0) {
          console.log(
            "Passenger ride history fetched successfully:",
            res.data.rides
          );
          setRows(res.data.rides);
          setEmpty(false);
        } else {
          setEmpty(true);
          setRows([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching passenger ride history:", error);
        addToast({
          title: "Error",
          description:
            "Failed to fetch ride history. Please try again later.",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
          color: "danger",
          variant: "flat",
        });
        setEmpty(true);
      })
      .finally(() => {
        setLoading(false);
      });
    } 
    else if (user.type === "driver") 
    {
      api.get(`/ride/driverHistory?driverId=${user.id}`)
      .then((res) => {
        if (res.data.rides && res.data.rides.length > 0) {
          console.log(
            "Driver ride history fetched successfully:",
            res.data.rides
          );
          setRows(res.data.rides);
          setEmpty(false);
        } else {
          setEmpty(true);
          setRows([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching driver ride history:", error);
        addToast({
          title: "Error",
          description:
            "Failed to fetch ride history. Please try again later.",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
          color: "danger",
          variant: "flat",
        });
        setEmpty(true);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  };

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = getKeyValue(item, columnKey);
    console.log("Cell Value:", cellValue, "Column Key:", columnKey);

    if (columnKey === "status") 
    {
      return (
        <Chip color={statusColorMap[cellValue]} variant="flat" size="sm">
          {cellValue}
        </Chip>
      );
    } 
    else if (columnKey === "createdAt") 
    {
      const date = new Date(cellValue);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } 
    else if (columnKey === "driverId" && (!cellValue || cellValue === "undefined")) 
    {
      return "Not Assigned";
    }
    else 
    {
      return cellValue;
    }
  }, []);

  React.useEffect(() => {
    fetchRideHistory();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-8 px-4 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Ride History</h1>
        <p className="text-lg text-gray-600">View your past rides below</p>
        <Button
          isIconOnly
          color="primary"
          variant="light"
          aria-label="Refresh"
          onPress={() => fetchRideHistory()}
          className="mt-4"
        >
          <RefreshCwIcon />
        </Button>
      </div>

      <div className="w-full max-w-7xl bg-white p-8 rounded-lg shadow">
        <Table aria-label="Ride History Table">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key} className="text-left">
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>

          {empty ? (
            <TableBody emptyContent="No rides found" className="text-center">
              {[]}
            </TableBody>
          ) : loading ? (
            <TableBody emptyContent="Loading rides..." className="text-center">
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <div className="flex flex-row items-center justify-center space-x-4">
                    <Spinner size="md" />
                    <p className="text-gray-500">
                      Fetching your ride history...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default RideHistoryTable;
