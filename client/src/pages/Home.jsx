import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [homestayListings, sethomestayListings] = useState([]);
  const [resortListings, setresortListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=5');
        const data = await res.json();
        setOfferListings(data);
        fetchresortListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchresortListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=resort&limit=5');
        const data = await res.json();
        setresortListings(data);
        console.log(data);
        fetchhomestayListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchhomestayListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=homestay&limit=5');
        const data = await res.json();
        sethomestayListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Welcome to our booking platform!
          <br />
          Whether you’re seeking a beachfront resort, a boutique hotel, 
          or an authentic homestay experience, we’ve got you covered.
          <br /> 
          Explore our wide range of accommodations and enjoy exclusive discounts on your next stay. 
          <br />
          Book now and make memories!
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, homestay and resort */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {resortListings && resortListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for resort</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=resort'}>Show more places for resort</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {resortListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {homestayListings && homestayListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for homestay</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=homestay'}>Show more places for homestay</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {homestayListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
