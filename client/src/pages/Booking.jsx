import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

export default function Booking() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [showBookingsError, setShowBookingsError] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  console.log(userBookings);
  useEffect(() => {
    const fetchBookings = async () => {
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
    fetchBookings();
  }, []);
  
  const handleBookingDelete = async (bookingId) => {
    try {
      const res = await fetch(`/api/booking/delete/${bookingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };
  // return (
  //   <div className='p-3 max-w-4xl mx-auto'>
  //     <h1 className='text-3xl font-semibold text-center my-7'>
  //         Your Bookings
  //     </h1>

  //     {userBookings && userBookings.length > 0 && (
  //       <div className='flex flex-col gap-4'>
  //         {userBookings.map((booking) => (
  //           <div
  //             key={booking._id}
  //             className='border rounded-lg p-3 flex justify-between items-center gap-4'
  //           >
  //             <Link to={`/booking/${booking._id}`}>
  //               <img
  //                 src={booking.imageUrls[0]}
  //                 alt='booking cover'
  //                 className='h-16 w-16 object-contain'
  //               />
  //             </Link>
  //             <Link
  //               className='text-slate-700 font-semibold  hover:underline truncate flex-1'
  //               to={`/booking/${booking._id}`}
  //             >
  //               <p>{booking.placeName}</p>
  //             </Link>

  //             <div className='flex flex-col item-center'>
  //               <button
  //                 onClick={() => handleBookingDelete(booking._id)}
  //                 className='text-red-700 uppercase'
  //               >
  //                 Delete
  //               </button>
  //               <Link to={`/update-booking/${booking._id}`}>
  //                 <button className='text-green-700 uppercase'>Edit</button>
  //               </Link>
  //             </div>
  //           </div>
  //         ))}
  //         </div>
  //     )}
  //   </div>
  // )


  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Your Bookings
      </h1>
  
      {userBookings && userBookings.length > 0 && (
        <div className='flex flex-col gap-4'>
          {userBookings.map((booking) => (
            <div
              key={booking._id}
              className='bg-white border rounded-lg p-3 flex justify-between items-center gap-4 text'
            >
              <Link to={`/update-booking/${booking._id}`}>
                <img
                  src={booking.imageUrls[0]}
                  alt='booking cover'
                  className='h-128 w-64 object-contain'
                />
              </Link>
              <div className='flex-1'>
                <Link
                  className='text-slate-700 text-2xl font-semibold hover:underline truncate'
                  to={`/update-booking/${booking._id}`}
                >
                  <p>{booking.placeName}</p>
                </Link>
                <div className=' text-slate-500 text-xl'>
                  <p>
                    <span className='font-semibold '>From:</span> {formatDate(booking.checkInDay)} 
                    <span className='mr-5'></span>
                    <span className='font-semibold '> To:</span> {formatDate(booking.checkOutDay)}
                  </p>
                  <p>
                    <span className='font-semibold'>Rooms:</span> {booking.rooms}
                  </p>
                  <p>
                    <span className='font-semibold'>Guests:</span> {booking.guests}
                  </p>
                  <p>
                    <span className='font-semibold'>Total Price:</span> ${booking.price}
                  </p> 
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <button
                  onClick={() => handleBookingDelete(booking._id)}
                  className='text-red-700 uppercase mb-2'
                >
                  Delete
                </button>
                <Link to={`/update-booking/${booking._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

}
