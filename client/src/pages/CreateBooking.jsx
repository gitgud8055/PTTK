import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateBooking() {
  const { currentUser } = useSelector((state) => state.user);
  const { currentItem } = useSelector((state) => state.item);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    checkInDay: '',
    checkOutDay: '',
    length: 0,
    price: 0,
    rooms: 0,
    guests: 0,
    placeName: '',
    type: '',
    address: '',
    imageUrls: [],
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.id === 'checkOutDay' && 
    ((new Date (e.target.value)).getTime()
    - (new Date (formData.checkInDay)) .getTime()) < 0)
    {
      alert('Check-out date cannot be before check-in date.');
      e.target.value = '';
    }
      
    setFormData({
    ...formData,
    [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          placeName: currentItem.name,
          type: currentItem.type,
          address: currentItem.address,
          imageUrls: currentItem.imageUrls,
        }),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/profile`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>
            Create a Booking
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input
                    type='text'
                    placeholder='Place name'
                    className='border p-3 rounded-lg'
                    id='placeName'
                    maxLength='62'
                    minLength='1'
                    required
                    onChange={handleChange}
                    value={currentItem.name}
                    disabled
                />
                <input
                    type='text'
                    placeholder='Type'
                    className='border p-3 rounded-lg'
                    id='type'
                    maxLength='62'
                    minLength='1'
                    required
                    onChange={handleChange}
                    value={currentItem.type}
                    disabled
                />
                <input
                    type='text'
                    placeholder='Address'
                    className='border p-3 rounded-lg'
                    id='address'
                    maxLength='62'
                    minLength='1'
                    required
                    onChange={handleChange}
                    value={currentItem.address}
                    disabled
                />
                <input
                    type='text'
                    placeholder='First name'
                    className='border p-3 rounded-lg'
                    id='firstName'
                    maxLength='62'
                    minLength='1'
                    required
                    onChange={handleChange}
                    value={formData.firstName}
                />
                <input
                    type='text'
                    placeholder='Last name'
                    className='border p-3 rounded-lg'
                    id='lastName'
                    maxLength='62'
                    minLength='1'
                    required
                    onChange={handleChange}
                    value={formData.lastName}
                />
                <input
                    type='email'
                    placeholder='Email'
                    className='border p-3 rounded-lg'
                    id='email'
                    maxLength='62'
                    minLength='1'
                    required
                    onChange={handleChange}
                    value={formData.email}
                />
                <input
                    type='text'
                    placeholder='Telephone'
                    className='border p-3 rounded-lg'
                    id='telephone'
                    maxLength='62'
                    minLength='1'
                    required
                    onChange={handleChange}
                    value={formData.telephone}
                />
                <input
                    type='Date'
                    placeholder='Check in'
                    className='border p-3 rounded-lg'
                    id='checkInDay'
                    required
                    onChange={handleChange}
                    value={formData.checkInDay}
                />
                <input
                    type='Date'
                    placeholder='Check out'
                    className='border p-3 rounded-lg'
                    id='checkOutDay'
                    required
                    onChange={handleChange}
                    value={formData.checkOutDay}
                />
                <div className='flex items-center gap-2'>
                    <input
                        type='number'
                        id='rooms'
                        min='1'
                        max='10'
                        required
                        className='p-3 border border-gray-300 rounded-lg'
                        onChange={handleChange}
                        value={formData.rooms}
                    /> <p>Rooms</p>
                </div>     
                <div className='flex items-center gap-2'>
                    <input
                        type='number'
                        id='guests'
                        min='1'
                        max='30'
                        required
                        className='p-3 border border-gray-300 rounded-lg'
                        onChange={handleChange}
                        value={formData.guests}
                    /> 
                    <p>Guests</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input
                        type='number'
                        id='price'
                        disabled
                        required
                        className='p-3 border border-gray-300 rounded-lg'
                        onChange={handleChange}
                        value={currentItem.regularPrice * formData.rooms * 
                          (((new Date (formData.checkOutDay)).getTime()
                          - (new Date (formData.checkInDay)) .getTime()) 
                          / ((1000 * 3600 * 24)))
                        }
                    />
                    <p>Total price</p>
                </div>
                <button disabled={loading || uploading}
                className='p-3 bg-slate-700 text-white rounded-lg uppercase 
                hover:opacity-95 disabled:opacity-80' >
                {loading ? 'Creating...' : 'Create booking'}
                </button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
        </form>
    </div>
  )
}
