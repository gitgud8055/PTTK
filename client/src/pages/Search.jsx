import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem.jsx';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    address: '',
    type: '',
    smoking: false,
    bar: false,
    wifi: false,
    parking: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const addressFromUrl = urlParams.get('address');
    const typeFromUrl = urlParams.get('type');
    const barFromUrl = urlParams.get('bar');
    const wifiFromUrl = urlParams.get('wifi');
    const smokingFromUrl = urlParams.get('smoking');
    const parkingFromUrl = urlParams.get('parking');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      addressFromUrl ||
      typeFromUrl ||
      barFromUrl ||
      smokingFromUrl ||
      wifiFromUrl || 
      parkingFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        address: addressFromUrl || '',
        type: typeFromUrl || '',
        smoking: smokingFromUrl === 'true' ? true : false,
        parking: parkingFromUrl === 'true' ? true : false,
        wifi: wifiFromUrl === 'true' ? true : false,
        bar: barFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'resort' ||
      e.target.id === 'homestay'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === 'address') {
      setSidebardata({ ...sidebardata, address: e.target.value });
    }

    if (
      e.target.id === 'smoking' ||
      e.target.id === 'parking' ||
      e.target.id === 'bar' ||
      e.target.id === 'wifi' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('address', sidebardata.address);
    urlParams.set('type', sidebardata.type);
    urlParams.set('smoking', sidebardata.smoking);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('bar', sidebardata.bar);
    urlParams.set('wifi', sidebardata.wifi);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Place name:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Where are you going?'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Address:
            </label>
            <input
              type='text'
              id='address'
              placeholder='Address?'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.address}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
            <input
                type='checkbox'
                id='resort'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'resort'}
              />
              <span>Resort</span>
            </div>
            <div className='flex gap-2'>
            <input
                type='checkbox'
                id='homestay'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'homestay'}
              />
              <span>Homestay</span>
            </div>
            <div className='flex gap-2'>
            <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
            <input
                type='checkbox'
                id='smoking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.smoking}
              />
              <span>Smoking allowed</span>
            </div>
            <div className='flex gap-2'>
            <input
                type='checkbox'
                id='bar'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.bar}
              />
              <span>Bar</span>
            </div>
            <div className='flex gap-2'>
            <input
                type='checkbox'
                id='wifi'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.wifi}
              />
              <span>Wifi</span>
            </div>
            <div className='flex gap-2'>
            <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Have parking spots</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='ratings_desc'>Rating high to low</option>
              <option value='ratings_asc'>Rating low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
            Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
            {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}