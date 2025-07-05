import React from "react";
import { RefreshCwIcon, User2Icon } from "lucide-react";
import {
  Card,
  CardBody,
  Breadcrumbs,
  BreadcrumbItem,
  Avatar,
  Button,
  Chip,
  Spinner,
  addToast,
} from "@heroui/react";

import api from "../../utils/api";
import useUserStore from "../../context/store";

const PassengerDashboardBody = () => {
  //probably just show current ride if any. when user requests a ride, navigate here and show a card

  const [ride, setRide] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const user = useUserStore((state) => state.user);

  const generateBreadcrumbsList = () => {
    //generate the breadcrumbs list based on the ride status
    const statusListColorMap = {
      requested: "warning",
      "in-progress": "primary",
      completed: "success",
      cancelled: "danger",
    };

    // Special handling for cancelled rides
    if (ride.status === "cancelled") 
    {
      return ["requested", "cancelled"].map((status, index) => (
        <BreadcrumbItem key={index} className="text-sm font-medium">
          <Chip
            color={statusListColorMap[status]}
            variant="flat"
            className="capitalize"
          >
            {status}
          </Chip>
        </BreadcrumbItem>
      ));
    }

    // Normal progression
    const statusList = ["requested", "in-progress", "completed"];

    const currentStatusIndex = statusList.indexOf(ride.status);
    return statusList.slice(0, currentStatusIndex + 1).map((status, index) => (
      <BreadcrumbItem key={index} className="text-sm font-medium">
        <Chip
          color={statusListColorMap[status]}
          variant="flat"
          className="capitalize"
        >
          {status}
        </Chip>
      </BreadcrumbItem>
    ));
  };

  const getLastestRide = () => {
    console.log("Fetching latest ride for user:", user.id);
    setLoading(true);

    api.get(`/ride/latest?userId=${user.id}`)
    .then((res) => {
      setLoading(false);
      if (res.data.ride) setRide(res.data.ride);
    })
    .catch((error) => {
      setLoading(false);
      console.error("Error fetching latest ride:", error);
      addToast({
        title: "Error",
        description: "Failed to fetch latest ride. Please try again later.",
        timeout: 4000,
        shouldShowTimeoutProgress: true,
        color: "danger",
        variant: "flat",
      });
    });
  };

  React.useEffect(() => {
    getLastestRide();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-8 px-4 bg-gray-50">
      <Card className="w-full max-w-2xl bg-white p-8 rounded-lg shadow">
        <CardBody className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Current Ride</h1>
            <Button
              isIconOnly
              color="primary"
              variant="light"
              aria-label="Refresh"
              onPress={() => getLastestRide()}
            >
              <RefreshCwIcon />
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-row items-center justify-center space-x-4">
              <Spinner size="md" />
              <p className="text-gray-500">
                Fetching your latest ride...
              </p>
            </div>
          ) 
          : !ride ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                You don't have any active rides.
              </p>
              <Button color="primary" as="a" href="/passenger/request">
                Request a Ride
              </Button>
            </div>
          ) 
          : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar
                    icon={<User2Icon size={40} />}
                    alt={ride.driverName}
                    className="h-14 w-14"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Driver</p>
                    <p className="text-lg font-medium">{ride.driverName}</p>
                    <p className="text-xs text-gray-400">
                      ID: {ride.driverId || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Ride ID</p>
                  <p className="font-medium">{ride.rideId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pickup Location</p>
                  <p className="font-medium">{ride.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dropoff Location</p>
                  <p className="font-medium">{ride.dropoffLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ride Type</p>
                  <p className="font-medium">{ride.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created At</p>
                  <p className="font-medium">
                    {new Date(ride.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Distance</p>
                  <p className="font-medium">{(ride.distance / 1000).toFixed(2)} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fare</p>
                  <p className="font-medium">
                    {ride.fare ? ride.fare.toFixed(2) : "N/A"} PKR
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-2">
                <p className="text-base text-gray-500 mb-3">Ride Status</p>
                <Breadcrumbs>{generateBreadcrumbsList()}</Breadcrumbs>
              </div>

              <div className="mt-8 flex justify-end">
                {/* <Button color="danger" variant="flat" className="mr-2">
                  Cancel Ride
                </Button> */}
                <Button color="primary" as="a" href="/passenger/history">
                  View History
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PassengerDashboardBody;
