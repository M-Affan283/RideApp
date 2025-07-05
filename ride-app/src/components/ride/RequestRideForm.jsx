import { useState } from "react";
import {
  VoteIcon,
  MapPinIcon,
  MapPinCheckInsideIcon,
  CarIcon,
} from "lucide-react";
import {
  Form,
  Input,
  Button,
  RadioGroup,
  Radio,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Card,
  CardBody,
  Avatar,
  Divider,
  addToast
} from "@heroui/react";

import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import useUserStore from "../../context/store";

const RequestRideForm = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [rideType, setRideType] = useState("Car");
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (pickup === "" || dropoff === "" || rideType === "")
    {
      addToast({
        title: "Error",
        description: "Please fill in all fields before requesting a ride.",
        timeout: 4000,
        shouldShowTimeoutProgress: true,
        color: "danger",
        variant: "flat"
      });
      return;
    }
    
    setIsLoading(true);
    
    api.post("/ride/request", {
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      rideType: rideType,
      passengerId: user.id, 
    })
    .then((res)=>
    {
      setIsLoading(false);
      console.log("Ride requested successfully:", res.data);
      onOpen();
    })
    .catch((error)=>
      {
        setIsLoading(false);
        console.error("Error requesting ride:", error);
        addToast({
          title: "Error",
          description: "Failed to request ride. Please try again later.",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
          color: "danger",
          variant: "flat"
        });
    })
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-8 px-4 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Request a Ride</h1>
        <p className="text-lg text-gray-600">Enter your trip details below</p>
      </div>

      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow">
        <Form className="flex flex-col gap-6" onSubmit={() => handleSubmit()}>
          <Input
            isRequired
            label="Pickup Location"
            labelPlacement="outside"
            placeholder="Enter pickup address"
            startContent={
              <i className="fas fa-map-marker-alt text-default-400 text-sm"></i>
            }
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="text-lg"
            size="lg"
          />

          <Input
            isRequired
            label="Dropoff Location"
            labelPlacement="outside"
            placeholder="Enter destination address"
            startContent={
              <i className="fas fa-map-pin text-default-400 text-sm"></i>
            }
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="text-lg"
            size="lg"
          />

          <div className="mt-4">
            <p className="text-lg font-medium mb-3">Choose Ride Type</p>
            <RadioGroup
              orientation="horizontal"
              value={rideType}
              onValueChange={setRideType}
              className="justify-center gap-8"
            >
              <Radio value="Bike">
                <div className="flex flex-col items-center">
                  <i className="fas fa-motorcycle text-2xl mb-1"></i>
                  <span className="text-base">Bike</span>
                </div>
              </Radio>
              <Radio value="Car">
                <div className="flex flex-col items-center">
                  <i className="fas fa-car text-2xl mb-1"></i>
                  <span className="text-base">Car</span>
                </div>
              </Radio>
              <Radio value="Rickshaw">
                <div className="flex flex-col items-center">
                  <i className="fas fa-taxi text-2xl mb-1"></i>
                  <span className="text-base">Rickshaw</span>
                </div>
              </Radio>
            </RadioGroup>
          </div>

          <Button
            color="primary"
            size="lg"
            className="mt-6 text-lg font-semibold py-6"
            onPress={handleSubmit}
          >
            Request Ride
          </Button>
        </Form>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        isDismissable={false}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Ride Details</ModalHeader>
              <ModalBody>
                {isLoading ? (
                  <div className="flex flex-row items-center justify-center space-x-4 p-4">
                    <Spinner size="md" />
                    <p className="text-gray-500">Booking your ride...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Avatar
                      icon={<VoteIcon size={40} />}
                      className="w-16 h-16 bg-success-100 text-success-500 mb-4"
                    />
                    <h4 className="text-xl font-semibold mb-6">
                      Ride Requested Successfully!
                    </h4>

                    <Card className="w-full mb-6">
                      <CardBody className="gap-5">
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
                            <p className="font-medium">{pickup}</p>
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
                            <p className="font-medium">{dropoff}</p>
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
                            <p className="font-medium capitalize">{rideType}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Button
                      color="primary"
                      variant="light"
                      onPress={() => {
                        setIsLoading(false);
                        onClose();
                        navigate("/passenger/dashboard"); // Redirect to passenger dashboard
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RequestRideForm;
