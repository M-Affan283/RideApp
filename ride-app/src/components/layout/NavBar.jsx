import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";

import useUserStore from "../../context/store";

const NavBar = () => {
  const [userType, setUserType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  // Determine user type based on URL path
  useEffect(() => {
    // if (location.pathname.includes("/passenger")) {
    //   setUserType("passenger");
    //   setIsLoggedIn(true);
    // } else if (location.pathname.includes("/driver")) {
    //   setUserType("driver");
    //   setIsLoggedIn(true);
    // } else {
    //   setUserType("");
    //   setIsLoggedIn(false);
    // }

    if (!user) {
      setUserType("");
      setIsLoggedIn(false);
      return;
    }

    if (user.type === "passenger")
    {
      setUserType("passenger");
      setIsLoggedIn(true);
    }
    else if (user.type === "driver")
    {
      setUserType("driver");
      setIsLoggedIn(true);
    }
    else
    {
      setUserType("");
      setIsLoggedIn(false);
    }
  }, [user, location]);

  const logout = () => 
  {
    clearUser();
    setUserType("");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Navbar>
      <NavbarBrand>
        {/* logo + name */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 128"
          className="h-10 w-10"
        >
          <path d="M57.143 45.99H35.154a1 1 0 0 0-.994.891l-.826 7.528a1.007 1.007 0 0 0 .994 1.109h22.815a1 1 0 0 0 1-1V46.99a1 1 0 0 0-1-1zM94.12 77.64a14.325 14.325 0 1 0 14.32 14.32 14.34 14.34 0 0 0-14.32-14.32zm0 22.13a7.806 7.806 0 1 1 7.8-7.806 7.815 7.815 0 0 1-7.801 7.806zM33.88 77.64a14.325 14.325 0 1 0 14.33 14.32 14.331 14.331 0 0 0-14.33-14.32zm0 22.13a7.806 7.806 0 1 1 7.806-7.806 7.814 7.814 0 0 1-7.805 7.806zM69.76 28.31a2.005 2.005 0 0 0-1.97-1.65H47a2.005 2.005 0 0 0-1.97 1.65l-.02.11-.84 3.57h26.45z" />
          <path d="M94.119 88.159a3.806 3.806 0 1 0 3.8 3.8 3.81 3.81 0 0 0-3.8-3.8zM12.91 73.41a1.328 1.328 0 0 0-1.31-1.48H7.44v2.96h4.16a1.464 1.464 0 0 0 1.31-1.48zM82.311 45.99H70.856a1 1 0 0 0-1 1v8.528a1 1 0 0 0 1 1H89.78a1.008 1.008 0 0 0 1-1.058l-.127-2.191a8.438 8.438 0 0 0-8.342-7.279zM111.09 73.41a1.478 1.478 0 0 0 1.31 1.48h8.16v-2.96h-8.16a1.489 1.489 0 0 0-1.31 1.48z" />
          <path d="M107.09 73.41a5.293 5.293 0 0 1 5.31-5.48h7.43a12.933 12.933 0 0 0-12.18-8.63h-1.75a5 5 0 0 1-4.95-4.36 21.771 21.771 0 0 0-21.54-18.95H34.28a10.017 10.017 0 0 0-9.91 8.72l-1.32 10.23a5.014 5.014 0 0 1-4.96 4.36h-2.63a8.018 8.018 0 0 0-8.02 8.63h4.16a5.483 5.483 0 0 1 0 10.96H7.44v8.27a3.009 3.009 0 0 0 3 3h5.2a18.335 18.335 0 0 1 36.49 0h23.74a18.335 18.335 0 0 1 36.49 0h5.2a3.009 3.009 0 0 0 3-3v-8.27h-8.16a5.334 5.334 0 0 1-5.31-5.48zM62.143 54.518a5.006 5.006 0 0 1-5 5H34.328a5 5 0 0 1-4.971-5.546l.827-7.527a4.994 4.994 0 0 1 4.97-4.455h21.989a5.006 5.006 0 0 1 5 5zm31.274 4.432a5.023 5.023 0 0 1-3.637 1.568H70.856a5.007 5.007 0 0 1-5-5V46.99a5.006 5.006 0 0 1 5-5h11.455a12.447 12.447 0 0 1 12.317 10.834l.144 2.405a5.024 5.024 0 0 1-1.355 3.721z" />
          <path d="M33.881 88.159a3.806 3.806 0 1 0 3.806 3.8 3.809 3.809 0 0 0-3.806-3.8z" />
        </svg>

        <p className="font-bold text-lg ml-2">Jeeny Ride</p>
      </NavbarBrand>

      {/* Nav items based on user type */}
      <NavbarContent className="gap-x-7 hidden sm:flex" justify="center">
        {isLoggedIn && userType === "passenger" && (
          <>
            <NavbarItem>
              <Link
                className={
                  location.pathname === "/passenger/dashboard"
                    ? "text-primary font-bold"
                    : ""
                }
                href="/passenger/dashboard"
              >
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                className={
                  location.pathname === "/passenger/request"
                    ? "text-primary font-bold"
                    : ""
                }
                href="/passenger/request"
              >
                Request a Ride
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link 
                className={
                  location.pathname === "/passenger/history"
                    ? "text-primary font-bold"
                    : ""
                }
                href="/passenger/history"
              >
                Ride History
              </Link>
            </NavbarItem>
          </>
        )}

        {isLoggedIn && userType === "driver" && (
          <>
            <NavbarItem>
              <Link
                className={
                  location.pathname === "/driver/dashboard"
                    ? "text-primary font-bold"
                    : ""
                }
                href="/driver/dashboard"
              >
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/driver/available">Available Rides</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/driver/history">My Rides</Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* User profile and auth actions */}
      <NavbarContent justify="end">
        {isLoggedIn ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                size="sm"
                name="User"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Profile</DropdownItem>
              {userType === "passenger" ? (
                <DropdownItem
                  key="switch_to_driver"
                  onPress={() => navigate("/driver/dashboard")}
                >
                  Switch to Driver
                </DropdownItem>
              ) : (
                <DropdownItem
                  key="switch_to_passenger"
                  onPress={() => navigate("/passenger/dashboard")}
                >
                  Switch to Passenger
                </DropdownItem>
              )}
              <DropdownItem
                key="logout"
                color="danger"
                onPress={logout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem>
              <Button as={Link} color="primary" href="/login" variant="flat">
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/register"
                variant="solid"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
