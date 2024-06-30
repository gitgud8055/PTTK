import Booking from "../models/booking.model.js";
import { errorHandler } from '../utils/error.js';

export const createBooking = async (req, res, next) => {
    try {
        const booking = await Booking.create(req.body);
        return res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
};

export const deleteBooking = async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);
  
    if (!booking) {
      return next(errorHandler(404, 'Booking not found!'));
    }
  
    if (req.user.id !== booking.userRef) {
      return next(errorHandler(401, 'You can only delete your own bookings!'));
    }
  
    try {
      await Booking.findByIdAndDelete(req.params.id);
      res.status(200).json('Booking has been deleted!');
    } catch (error) {
      next(error);
    }
  };

export const updateBooking = async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(errorHandler(404, 'Booking not found!'));
    }
    if (req.user.id !== booking.userRef) {
      return next(errorHandler(401, 'You can only update your own bookings!'));
    }
  
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedBooking);
    } catch (error) {
      next(error);
    }
  };

    export const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
          return next(errorHandler(404, 'Booking not found!'));
        }
        res.status(200).json(booking);
      } catch (error) {
        next(error);
        }
    };

//     export const getBookings = async (req, res, next) => {
//         try {
//           const limit = parseInt(req.query.limit) || 9;
//           const startIndex = parseInt(req.query.startIndex) || 0;
//           let offer = req.query.offer;
      
//           if (offer === undefined || offer === 'false') {
//             offer = { $in: [false, true] };
//           }
      
//           let pet = req.query.pet;
      
//           if (pet === undefined || pet === 'false') {
//             pet = { $in: [false, true] };
//           }

//           let pool = req.query.pool;

//           if (pool === undefined || pool === 'false') {
//             pool = { $in: [false, true] };
//           }
      
//           let type = req.query.type;
      
//           if (type === undefined || type === 'all') {
//             type = { $in: ['homestay', 'resort'] };
//           }
      
//           const searchTerm = req.query.searchTerm || '';
      
//           const sort = req.query.sort || 'createdAt';
      
//           const order = req.query.order || 'desc';
      
//           const bookings = await Booking.find({
//             name: { $regex: searchTerm, $options: 'i' },
//             offer,
//             pet,
//             pool,
//             type,
//           })
//             .sort({ [sort]: order })
//             .limit(limit)
//             .skip(startIndex);
      
//           return res.status(200).json(bookings);
//         } catch (error) {
//           next(error);
//         }
//       };