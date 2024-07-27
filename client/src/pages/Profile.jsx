import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  //
  const [showBookingsError, setShowBookingsError] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  //
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const resetLayout = () => {
    setShowBookingsError(false);
    setShowListingsError(false);
    setUserBookings([]);
    setUserListings([]);
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    resetLayout();
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleShowBookings = async () => {
    resetLayout();
    try {
      setShowBookingsError(false);
      const res = await fetch(`/api/user/bookings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowBookingsError(true);
        return;
      }

      setUserBookings(data);
    } catch (error) {
      setShowBookingsError(true);
    }
  };

  const showListingSection = () => {
    return (
      <>
        <p className="text-red-700 mt-5">
          {showListingsError ? "Error showing listings" : ""}
        </p>
        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">
              Your Registered Centers
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col item-center">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };
  const showBookingSection = () => {
    return (
      <>
        <p className="text-red-700 mt-5">
          {showBookingsError ? "Error showing Bookings" : ""}
        </p>
        {userBookings && userBookings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">
              Your Bookings
            </h1>
            <hr />
            <table className="table border border-black border-3">
              <thead>
                <tr className="border border-black border-2">
                  <th className="border border-black border-1">Sl. No.</th>
                  <th className="border border-black border-1">Prescription</th>
                  <th className="border border-black border-1">Lab Name</th>
                  <th className="border border-black border-1">
                    Patient's Name
                  </th>
                  <th className="border border-black border-1">
                    Patient's Address
                  </th>
                  <th className="border border-black border-1">Contact No.</th>
                  <th className="border border-black border-1">Booking Date</th>
                  <th className="border border-black border-1"></th>
                </tr>
              </thead>
              <tbody className="border border-black border-1">
                <tr>
                  <td span="8">&nbsp;</td>
                </tr>
                {userBookings.map((booking) => (
                  <tr>
                    <td className="border border-black border-1">1. </td>
                    <td className="border border-black border-1">
                      <Link to={`/booking/${booking._id}`}>
                        <img
                          src={booking.imageUrls[0]}
                          alt="bookin cover"
                          className="h-16 w-16 object-contain"
                        />
                      </Link>
                    </td>

                    <td className="border border-black border-1">
                      <Link
                        className="border text-slate-700 font-semibold  hover:underline truncate flex-1"
                        to={`/booking/${booking._id}`}
                      >
                        <p>{booking.labName}</p>
                      </Link>
                    </td>
                    <td className="border border-black border-1">
                      <Link
                        className='border text-slate-700 font-semibold  hover:underline truncate flex-1'
                        to={`/booking/${booking._id}`}
                      >
                        <p>{booking.name}</p>
                      </Link>
                    </td>
                    <td className="border border-black border-1">
                      <p>{booking.address}</p>
                      <p>{booking.pin_code}</p>
                    
                    </td>
                    <td className="border border-black border-1">
                    <p>{booking.contact_no}</p>
                    <p>{booking.contact_email}</p>
                    </td>
                    <td className="border border-black border-1">
                    <p>{booking.booking_date}</p>
                    </td>
                    <td className="border border-black border-1">
                    <Link
                        className='border text-slate-700 font-semibold  hover:underline truncate flex-1'
                        to={`/booking/${booking._id}`}
                      >
                        <p>Details</p>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  const showDummyTable = () => {
    return (
      <>
        <section class="bg-white py-20 dark:bg-dark lg:py-[120px]">
          <div class="container mx-auto">
            <div class="-mx-4 flex flex-wrap">
              <div class="w-full px-4">
                <div class="max-w-full overflow-x-auto">
                  <table class="w-full table-auto">
                    <thead>
                      <tr class="bg-primary text-center">
                        <th class="w-1/6 min-w-[160px] border-l border-transparent px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
                          TLD
                        </th>
                        <th class="w-1/6 min-w-[160px] px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
                          Duration
                        </th>
                        <th class="w-1/6 min-w-[160px] px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
                          Registration
                        </th>
                        <th class="w-1/6 min-w-[160px] px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
                          Renewal
                        </th>
                        <th class="w-1/6 min-w-[160px] px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
                          Transfer
                        </th>
                        <th class="w-1/6 min-w-[160px] border-r border-transparent px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
                          Register
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="border-b border-l border-[#E8E8E8] bg-[#F3F6FF] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
                          .com
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
                          1 Year
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-[#F3F6FF] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
                          $75.00
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
                          $5.00
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-[#F3F6FF] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
                          $10.00
                        </td>
                        <td class="border-b border-r border-[#E8E8E8] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
                          <a
                            href="javascript:void(0)"
                            class="inline-block rounded-md border border-primary px-6 py-2.5 font-medium text-primary hover:bg-primary hover:text-white"
                          >
                            Sign Up
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td class="border-b border-l border-[#E8E8E8] bg-[#F3F6FF] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
                          .com
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
                          1 Year
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-[#F3F6FF] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
                          $75.00
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
                          $5.00
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-[#F3F6FF] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
                          $10.00
                        </td>
                        <td class="border-b border-r border-[#E8E8E8] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
                          <a
                            href="javascript:void(0)"
                            class="inline-block rounded-md border border-primary px-6 py-2.5 font-medium text-primary hover:bg-primary hover:text-white"
                          >
                            Sign Up
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td class="border-b border-l border-[#E8E8E8] bg-[#F3F6FF] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
                          .com
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
                          1 Year
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-[#F3F6FF] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
                          $75.00
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
                          $5.00
                        </td>
                        <td class="border-b border-[#E8E8E8] bg-[#F3F6FF] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
                          $10.00
                        </td>
                        <td class="border-b border-r border-[#E8E8E8] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
                          <a
                            href="javascript:void(0)"
                            class="inline-block rounded-md border border-primary px-6 py-2.5 font-medium text-primary hover:bg-primary hover:text-white"
                          >
                            Sign Up
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  const getDashBoard = () => {
    return (
      <>
        {showListingSection()}
        {showBookingSection()}
        {/* {showDummyTable() } */}
      </>
    );
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 m-10 lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside>
          <div className="rounded-lg bg-slate-50 border-solid border-1 border-indigo-60 ">
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-3xl font-semibold">Profile</h1>
              <img
                src={currentUser.avatar}
                alt="profile"
                className="rounded-full h-24 w-24 object-cover self-center mt-2"
              />
              <hr />
              <span className="font-semibold">
                User Name: {currentUser.username}
              </span>
              <span className="font-semibold">Email: {currentUser.email}</span>

              <hr />
              <div className="flex flex-col text-center">
                <Link
                  className="bg-green-700 text-white p-2 m-2 rounded-lg uppercase text-center hover:opacity-95"
                  onClick={handleShowListings}
                >
                  My Centers
                </Link>

                <Link
                  className="bg-green-700 text-white p-2 m-2 rounded-lg uppercase text-center hover:opacity-95"
                  to={"/create-listing"}
                >
                  Add new center
                </Link>

                <hr />
                <Link
                  className="bg-green-700 text-white p-2 m-2 rounded-lg uppercase text-center hover:opacity-95"
                  onClick={handleShowBookings}
                >
                  My Bookings
                </Link>

                {/* <Link
              className='bg-red-300 text-red-700 m-2 p-2 m-2 rounded-lg uppercase text-center hover:opacity-95'
              onClick={handleDeleteUser}
            >
              Delete account
            </Link> */}
                <hr />
                <Link
                  className="bg-red-300 text-red-700 p-2 m-4 rounded-lg uppercase text-center hover:opacity-95"
                  onClick={handleSignOut}
                >
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </aside>
        <div className="rounded-lg bg-slate-50 border-solid border-2 border-indigo-60">
          {getDashBoard()}
        </div>
        <div className="rounded-lg bg-slate-50 border-solid border-2 border-indigo-60">
          <div className="p-3 max-w-lg mx-auto bg-slate-50 ">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
              />
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar}
                alt="profile"
                className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
              />
              <p className="text-sm self-center">
                {fileUploadError ? (
                  <span className="text-red-700">
                    Error Image upload (image must be less than 2 mb)
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className="text-green-700">
                    Image successfully uploaded!
                  </span>
                ) : (
                  ""
                )}
              </p>
              <input
                type="text"
                placeholder="username"
                defaultValue={currentUser.username}
                id="username"
                className="border p-3 rounded-lg"
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="email"
                id="email"
                defaultValue={currentUser.email}
                className="border p-3 rounded-lg"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="password"
                onChange={handleChange}
                id="password"
                className="border p-3 rounded-lg"
              />
              <button
                disabled={loading}
                className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
              >
                {loading ? "Loading..." : "Update"}
              </button>
            </form>
            {/* <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div> */}

            <p className="text-red-700 mt-5">{error ? error : ""}</p>
            <p className="text-green-700 mt-5">
              {updateSuccess ? "User is updated successfully!" : ""}
            </p>

            <button
              onClick={handleShowListings}
              className="text-green-700 w-full"
            >
              Show Listings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
