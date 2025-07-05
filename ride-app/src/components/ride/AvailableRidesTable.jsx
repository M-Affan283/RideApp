import React from "react";
import {
  EyeIcon,
  MapPinIcon,
  MapPinCheckInsideIcon,
  CarIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Chip,
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Avatar,
  Progress,
  Divider,
  useDisclosure,
  addToast,
} from "@heroui/react";

import api from "../../utils/api";
import useUserStore from "../../context/store";
import { useNavigate } from "react-router-dom";

const TIME_LIMIT = 120; // 2 minutes to accept otherwise ride will be removed from the list

const AvailableRidesTable = () => {
  const [rows, setRows] = React.useState([]);
  const [selectedRide, setSelectedRide] = React.useState(null);
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [loadingRide, setLoadingRide] = React.useState(false);
  const [loadingChoice, setLoadingChoice] = React.useState(false);
  const [empty, setEmpty] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(TIME_LIMIT); // Timer for ride acceptance
  const [columns, setColumns] = React.useState([
    { key: "id", label: "Ride ID" },
    { key: "pickupLocation", label: "Pickup Location" },
    { key: "dropoffLocation", label: "Dropoff Location" },
    { key: "type", label: "Ride Type" },
    // { key: "status", label: "Status" },
    { key: "distance", label: "Distance" },
    { key: "fare", label: "Fare" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions" },
  ]);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const fetchAvailableRides = async () => {
    console.log("Fetching available rides...");
    setLoadingTable(true);

    api
      .get(`/ride/driverAvailable?driverId=${user.id}`)
      .then((res) => {
        setLoadingTable(false);
        if (res.data.rides && res.data.rides.length > 0) {
          console.log("Available rides fetched successfully:", res.data.rides);
          setRows(res.data.rides);
          setEmpty(false);
        } else {
          setRows([]);
          setEmpty(true);
        }
      })
      .catch((error) => {
        setLoadingTable(false);
        console.error("Error fetching available rides:", error);
        addToast({
          title: "Error",
          description:
            "Failed to fetch available rides. Please try again later.",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
          color: "danger",
          variant: "flat",
        });
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  const handleRowClick = (ride) => {
    console.log("Selected Ride:", ride);
    setSelectedRide(ride);
    setTimeLeft(TIME_LIMIT); // reset timer to 2 minutes
    onOpen();
  };

  const handleRideRejection = () => {
    // Remove the ride from the table

    console.log("Rejected ride:", selectedRide?.id);

    setLoadingChoice(true);

    api.post(`/ride/updateStatus`, {
        rideId: selectedRide?.id,
        status: "cancelled",
        userId: user.id,
      })
      .then((res) => {
        console.log("Ride rejected successfully:", res.data);
        addToast({
          title: "Success",
          description: "Ride has been rejected successfully.",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
          color: "success",
          variant: "flat",
        });
        setRows((prevRows) =>
          prevRows.filter((ride) => ride.id !== selectedRide?.id)
        );
      })
      .catch((error) => {
        console.error("Error rejecting ride:", error);
        addToast({
          title: "Error",
          description: "Failed to reject ride. Please try again later.",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
          color: "danger",
          variant: "flat",
        });
      })
      .finally(() => {
        setLoadingChoice(false);
      });

    onClose();
  };

  const handleRideAcceptance = () => {
    console.log("Accepted ride:", selectedRide?.id);

    setLoadingChoice(true);

    api.post(`/ride/updateStatus`, {
        rideId: selectedRide?.id,
        status: "in-progress",
        userId: user.id,
        driverId: user.id,
      })
      .then((res) => {
        console.log("Ride accepted successfully:", res.data);
        addToast({
          title: "Success",
          description: "Ride has been accepted successfully.",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
          color: "success",
          variant: "flat",
        });
        navigate(`/driver/dashboard`);
      })
      .catch((error) => {
        console.error("Error accepting ride:", error);
        addToast({
          title: "Error",
          description: "Failed to accept ride. Please try again later.",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
          color: "danger",
          variant: "flat",
        });
      })
      .finally(() => {
        setLoadingChoice(false);
      });

    onClose();
  };

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = getKeyValue(item, columnKey);

    if (columnKey === "actions") {
      return (
        <Tooltip content="View Ride Details">
          <Button
            variant="flat"
            color="primary"
            size="sm"
            onPress={() => handleRowClick(item)}
            startContent={<EyeIcon />}
          >
            {/* View */}
          </Button>
        </Tooltip>
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
    } else {
      return cellValue;
    }
  }, []);

  React.useEffect(() => {
    fetchAvailableRides();
  }, []);

  // Timer for ride open in modal
  React.useEffect(() => {
    let timer = null;

    if (selectedRide && isOpen) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleRideRejection(); // Automatically reject the ride if time runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [selectedRide, isOpen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-8 px-4 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Rides</h1>
        <p className="text-lg text-gray-600">View and select rides below</p>
        <Button
          isIconOnly
          color="primary"
          variant="light"
          aria-label="Refresh rides"
          onPress={() => fetchAvailableRides()}
          className="mt-4"
        >
          <RefreshCwIcon />
        </Button>
      </div>

      <div className="w-full max-w-7xl bg-white p-8 rounded-lg shadow">
        <Table aria-label="Available Rides Table">
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
          ) : loadingTable ? (
            <TableBody emptyContent="Loading rides..." className="text-center">
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <div className="flex flex-row items-center justify-center space-x-4">
                    <Spinner size="md" />
                    <p className="text-gray-500">Fetching available rides...</p>
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ride Details
              </ModalHeader>
              <ModalBody>
                {loadingRide ? (
                  <div className="flex flex-row items-center justify-center space-x-4 p-4">
                    <Spinner size="md" />
                    <p className="text-gray-500">Loading ride details...</p>
                  </div>
                ) : (
                  selectedRide && (
                    <>
                      <div className="flex flex-col items-center mb-4">
                        <Chip
                          color="primary"
                          size="lg"
                          variant="flat"
                          className="mb-2"
                        >
                          {selectedRide.id}
                        </Chip>

                        {/* Timer display */}
                        <div className="w-full mt-2 mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold flex items-center">
                              <ClockIcon size={16} className="mr-1" /> Time to
                              respond: {timeLeft}s
                            </span>
                          </div>
                          <Progress
                            color={
                              timeLeft < 15
                                ? "danger"
                                : timeLeft < 30
                                ? "warning"
                                : "success"
                            }
                            value={(timeLeft / TIME_LIMIT) * 100}
                            size="md"
                            aria-label={`Time remaining: ${timeLeft} seconds`}
                          />
                        </div>
                      </div>

                      <Card className="w-full mb-4">
                        <CardBody className="gap-4">
                          <div className="flex items-center gap-3 py-2">
                            <Avatar
                              icon={<MapPinIcon size={20} />}
                              className="bg-primary-100 text-primary-500"
                              size="sm"
                            />
                            <div>
                              <p className="text-sm text-gray-500">
                                Pickup Location
                              </p>
                              <p className="font-medium">
                                {selectedRide.pickupLocation}
                              </p>
                            </div>
                          </div>

                          <Divider />

                          <div className="flex items-center gap-3 py-2">
                            <Avatar
                              icon={<MapPinCheckInsideIcon size={20} />}
                              className="bg-primary-100 text-primary-500"
                              size="sm"
                            />
                            <div>
                              <p className="text-sm text-gray-500">
                                Dropoff Location
                              </p>
                              <p className="font-medium">
                                {selectedRide.dropoffLocation}
                              </p>
                            </div>
                          </div>

                          <Divider />

                          <div className="flex items-center gap-3 py-2">
                            <Avatar
                              icon={<CarIcon size={20} />}
                              className="bg-primary-100 text-primary-500"
                              size="sm"
                            />
                            <div>
                              <p className="text-sm text-gray-500">Ride Type</p>
                              <p className="font-medium">{selectedRide.type}</p>
                            </div>
                          </div>

                          <Divider />

                          <div className="flex items-center gap-3 py-2">
                            <Avatar
                              icon={<UserIcon size={20} />}
                              className="bg-primary-100 text-primary-500"
                              size="sm"
                            />
                            <div className="flex flex-col gap-1">
                              <p className="text-sm text-gray-500">
                                Passenger ID
                              </p>
                              <p className="font-medium">
                                {selectedRide.passengerId._id}
                              </p>

                              <p className="text-sm text-gray-500">
                                Passenger Name
                              </p>
                              <p className="font-medium">
                                {selectedRide.passengerId.name || "N/A"}
                              </p>
                            </div>
                          </div>

                          <Divider />

                          <div className="flex items-center gap-3 py-2">
                            <Avatar
                              icon={<CalendarIcon size={20} />}
                              className="bg-primary-100 text-primary-500"
                              size="sm"
                            />
                            <div>
                              <p className="text-sm text-gray-500">
                                Created At
                              </p>
                              <p className="font-medium">
                                {selectedRide.createdAt}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </>
                  )
                )}
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-between w-full">
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={handleRideRejection}
                    isLoading={loadingChoice}
                    disabled={loadingChoice}
                  >
                    Reject
                  </Button>
                  <Button
                    color="success"
                    variant="solid"
                    onPress={handleRideAcceptance}
                    isLoading={loadingChoice}
                    disabled={loadingChoice}
                  >
                    Accept Ride
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AvailableRidesTable;
