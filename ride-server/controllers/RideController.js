import { User } from "../models/User.js";
import { Ride } from "../models/Ride.js";

const requestRide = async (req, res) => 
{
  
  const { passengerId, pickupLocation, dropoffLocation, rideType } = req.body;

  try 
  {

    const passenger = await User.findById(passengerId);

    if (!passenger) return res.status(404).json({ message: "Passenger not found" });

    if (["Car", "Bike", "Rickshaw"].includes(rideType) === false) return res.status(400).json({ message: "Invalid ride type" });

    const newRide = await Ride.create({
      passengerId,
      pickupLocation,
      dropoffLocation,
      type: rideType,
      fare: Math.floor(Math.random() * 1000) + 100, // Random fare between 100 and 1100
      distance: Math.floor(Math.random() * 5000) + 1000, // Random distance between 1000 and 6000 meters
      status: "requested",
    });

    res.status(201).json({
      message: "Ride requested successfully",
      ride: newRide,
    });
  } 
  catch (error) 
  {
    console.error("Error requesting ride:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRideStatus = async (req, res) => 
{
  const { rideId, status, userId } = req.body;

  try 
  {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // If user is not the driver or passenger of the ride, return unauthorized
    if ((ride.driverId && ride.driverId.toString() !== userId) && ride.passengerId.toString() !== userId) return res.status(403).json({ message: "User not authorized to update this ride" });

    // Validate status
    const validStatuses = [
      "requested",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid ride status" });

    if (ride.status === "completed" || ride.status === "cancelled") return res.status(400).json({ message: "Ride has already been completed or cancelled" });

    // Update ride status
    ride.status = status;

    //if driver accepts the ride, set status to in-progress
    if (status === "in-progress" || status === "completed") 
    {
      ride.driverId = req.body.driverId; // Assign driver if ride is in-progress
      if (!ride.driverId) return res.status(400).json({ message: "Driver ID is required for in-progress status" });
      
      if (user.type !== "driver") return res.status(403).json({message: "Only drivers can update ride to in-progress or complete"});
    }

    await ride.save();

    res.status(200).json({
      message: "Ride status updated successfully",
      ride,
    });
  } 
  catch (error) 
  {
    console.error("Error updating ride status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLatestRides = async (req, res) =>
{
  const { userId } = req.query;

  //get the most recent ride for the user
  try 
  {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.type === "passenger") 
    {

      const ride = await Ride.findOne({ passengerId: userId }).sort({ createdAt: -1 }).populate("driverId", "name"); // Populate driver details

      if (!ride) return res.status(200).json({ message: "No rides found for this passenger" });

      // Check if driverId exists, if not provide default values
      const driverInfo = ride.driverId
        ? 
        {
          driverName: ride.driverId.name,
          driverAvatar: ride.driverId.avatar,
          driverId: ride.driverId._id,
        }
        : 
        {
          driverName: "Searching",
          driverAvatar: "Searching",
          driverId: null,
        };

      res.status(200).json({
        message: "Latest ride retrieved successfully",
        ride: { ...ride._doc, ...driverInfo },
      });
    } 
    else if (user.type === "driver") 
    {
      const ride = await Ride.findOne({ driverId: userId }).sort({ createdAt: -1 }).populate("passengerId", "name");
      
      if (!ride) return res.status(200).json({ message: "No rides found for this driver" });

      res.status(200).json({
        message: "Latest ride retrieved successfully",
        ride: {
          ...ride._doc,
          id: ride._id,
          passengerName: ride.passengerId.name,
          passengerAvatar: ride.passengerId.avatar,
          passengerId: ride.passengerId._id,
        },
      });
    }
  } 
  catch (error) 
  {
    console.error("Error retrieving latest rides:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPassengerRideHistory = async (req, res) => 
{
  const { passengerId } = req.query;

  try 
  {
    const passenger = await User.findById(passengerId);
    if (!passenger)return res.status(404).json({ message: "Passenger not found" });
    

    const rides = await Ride.find({ passengerId }).sort({ createdAt: -1 })

    if (rides.length === 0) return res.status(200).json({ message: "No ride history found for this passenger" });

    //for rides with no driverId, set it to 'N/A'
    const ridesWithDriver = rides.filter((ride) => ride.driverId);
    const ridesWithoutDriver = rides.filter((ride) => !ride.driverId);

    // Populate only the ones with driverId
    const populatedRides = await Ride.populate(ridesWithDriver, { path: "driverId", select: "name" });

    // Merge them back together
    const retRides = [...populatedRides, ...ridesWithoutDriver].map((ride) => {
      // population check
      const driver = ride.driverId && typeof ride.driverId === 'object' ? ride.driverId : null;

      return {
        id: ride._id,
        ...ride._doc,
        driver_id: driver ? driver._id : "N/A",
        driver_name: driver ? `${driver.name}` : "N/A",
      };
    });

    res.status(200).json({
      message: "Passenger ride history retrieved successfully",
      rides: retRides,
    });

  } 
  catch (error) 
  {
    console.error("Error retrieving passenger ride history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDriverRideHistory = async (req, res) => 
{
  const { driverId } = req.query;

  try 
  {
    const driver = await User.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    const rides = await Ride.find({ driverId }).sort({ createdAt: -1 }).populate("passengerId", "name");;

    if (rides.length === 0) return res.status(200).json({ message: "No ride history found for this driver" });

    const retRides = rides.map((ride) => ({
      id: ride._id,
      ...ride._doc,
      passenger_id: ride.passengerId._id,
      passenger_name: `${ride.passengerId.name}`,
    }));

    res.status(200).json({
      message: "Driver ride history retrieved successfully",
      rides: retRides,
    });

  } 
  catch (error) 
  {
    console.error("Error retrieving driver ride history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDriverAvailableRides = async (req, res) => 
{
  const { driverId } = req.query;

  try 
  {
    const driver = await User.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    const rides = await Ride.find({ status: "requested" }).sort({ createdAt: -1 }).populate("passengerId", "name");

    if (rides.length === 0) return res.status(200).json({ message: "No available rides for this driver" });

    const retRides = rides.map((ride) => ({
      ...ride._doc,
      id: ride._id,
    }));

    res.status(200).json({
      message: "Available rides retrieved successfully",
      rides: retRides,
    });
  } 
  catch (error) 
  {
    console.error("Error retrieving available rides:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRideById = async (req, res) => 
{
  const { rideId } = req.query;

  try 
  {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    res.status(200).json({
      message: "Ride retrieved successfully",
      ride,
    });
  } 
  catch (error) 
  {
    console.error("Error retrieving ride by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRide = async (req, res) => 
{
  const { rideId, userId } = req.body;

  try 
  {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    
    // If user is not the driver or passenger of the ride, return unauthorized
    if ((ride.driverId && ride.driverId.toString() !== userId) && ride.passengerId.toString() !== userId) return res.status(403).json({ message: "User not authorized to delete this ride" });

    await Ride.deleteOne({ _id: rideId });

    res.status(200).json({
      message: "Ride deleted successfully",
    });
  } 
  catch (error) 
  {
    console.error("Error deleting ride:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  requestRide,
  updateRideStatus,
  getLatestRides,
  getPassengerRideHistory,
  getDriverRideHistory,
  getDriverAvailableRides,
  getRideById,
  deleteRide,
};
