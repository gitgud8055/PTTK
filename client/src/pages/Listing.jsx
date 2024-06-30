import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector, useDispatch } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    FaMapMarkerAlt,
    FaParking,
    FaSmoking,
    FaWineGlass,
    FaWifi,
    FaShare,
    FaBackward,
    FaStar,
    FaComment,
  } from 'react-icons/fa';

import {
  fetchItemStart, 
  fetchItemSuccess,
  fetchItemFailure,
} from '../redux/slice/itemSlice';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviewListings, setReviewListings] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    smoking: false,
    bar: false,
    wifi: false,
    parking: false,
    furnished: false,
    reviews: [],
    ratings: 0,
    numReviews: 0,
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        dispatch(fetchItemStart());
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          dispatch(fetchItemFailure(data.message));
          setError(true);
          setLoading(false);
          dispatch()
          return;
        }
        dispatch(fetchItemSuccess(data));

        setReviewListings(data.reviews);
        setFormData(data);
        setListing(data);

        setLoading(false);
        setError(false);
      } catch (error) {
        dispatch(fetchItemFailure(data.message));
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const [formReview, setFormReview] = useState({
    user: currentUser.username,
    rating: 0,
    comment: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);

      console.log(formReview.user);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          reviews: [...formData.reviews, formReview],
          userRef: currentUser._id,
          ratings: parseInt(formData.ratings) + parseInt(formReview.rating),
          numReviews: formData.reviews.length + 1,
        }),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.log('errr');
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormReview({
    ...formReview,
    [e.target.id]: e.target.value,
    });
  };

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaBackward
              className='text-slate-500'
              onClick={() => navigate(-1)}
            />
          </div>
          <div className='fixed top-[25%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'resort' && ' / night'}
            </p>
            <p className='flex items-center mt-2 gap-2 text-slate-600 text-xl'>
              <FaStar className='text-yellow-700' />
              {listing.numReviews > 0
                ? `${(listing.ratings / listing.numReviews).toFixed(2)}`
                : `No rated yet`}
              <FaComment className='text-yellow-700' />
              {listing.numReviews}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'resort' ? 'Resort' : 'Homestay'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                   ${+listing.regularPrice - +listing.discountPrice}
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaSmoking className='text-lg' />
                {listing.smoking ? 'Smoking allowed' : 'No smoking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaWineGlass className='text-lg' />
                {listing.bar ? 'Bar' : 'No bar'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaWifi className='text-lg' />
                {listing.wifi ? 'Wifi' : 'No wifi'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Have parking spots' : 'No parking spot'}
              </li>
            </ul>
            <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-booking"}>
                Book
            </Link>

            {reviewListings && reviewListings.length > 0 && (
              <div className='flex flex-col gap-4'>
                <h1 className='text-center mt-7 text-2xl font-semibold'>
                  User Reviews
                </h1>
                {reviewListings.slice(0, 3).map((listing) => (

                  <div key={listing._id}
                    className="p-4 bg-white rounded-lg shadow-lg mb-4">
                  <p className="font-semibold text-lg text-gray-800">{listing.user}</p>
                  <div className="flex items-center mb-2">
                    <span className="ml-2 text-gray-600">{listing.rating}/5</span>
                  </div>
                  <p className="text-gray-700">{listing.comment}</p>
                  </div>
                ))}
                </div>
            )}

            {/* REVIEW SECTION */}
            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
              <form onSubmit={handleSubmit}>
                <p className="text-xl font-semibold mb-4 text-gray-900">Leave a Review</p>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Rating
                  </label>
                  <input
                    type='number'
                    id='rating'
                    min='1'
                    max='5'
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    value={formReview.rating}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Comment
                  </label>
                  <textarea
                    type='text'
                    placeholder='Comment'
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id='comment'
                    required
                    onChange={handleChange}
                    value={formReview.comment}
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit comment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
