import { BookingModel } from "../booking/booking.model.js";
import { TourModel } from "../tour/tour.model.js";
import { UserStatus } from "../user/user.interface.js";
import { UserModel } from "../user/user.model.js";

const getDaysAgo = (days: number) => {
  const now = new Date();
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
};

const getBookingStatsFromDB = async () => {
  const sevenDaysAgo = getDaysAgo(7);
  const thirtyDaysAgo = getDaysAgo(30);

  const [
    totalBookings,
    totalBookingsByStatus,
    bookingsByPerTour,
    avgGuestCount,
    newBookingsInLastSevenDays,
    newBookingsInLastThirtyDays,
    uniqueUsersWithBookings,
  ] = await Promise.all([
    BookingModel.countDocuments(),
    BookingModel.aggregate([
      {
        $group: {
          _id: "$bookingStatus",
          count: { $sum: 1 },
        },
      },
    ]),
    BookingModel.aggregate([
      {
        $group: {
          _id: "$tour",
          bookingCount: { $sum: 1 },
        },
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "tours",
          localField: "_id",
          foreignField: "_id",
          as: "tour",
          pipeline: [{ $project: { title: 1 } }],
        },
      },
      { $unwind: "$tour" },
      {
        $project: {
          title: "$tour.title",
          bookingCount: 1,
        },
      },
    ]),
    BookingModel.aggregate([
      {
        $group: {
          _id: null,
          avgGuestCount: { $avg: "$guestCount" },
        },
      },
      {
        $project: {
          _id: 0,
          avgGuestCount: { $ceil: "$avgGuestCount" },
        },
      },
    ]),
    BookingModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    }),
    BookingModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    }),
    BookingModel.distinct("user"),
  ]);

  return {
    totalBookings,
    totalBookingsByStatus,
    bookingsByPerTour,
    avgGuestCount: avgGuestCount[0]?.avgGuestCount ?? 0,
    newBookingsInLastSevenDays,
    newBookingsInLastThirtyDays,
    totalUniqueUsersWithBookings: uniqueUsersWithBookings.length,
  };
};

const getPaymentStatsFromDB = async () => {};

const getTourStatsFromDB = async () => {
  const [
    totalTours,
    totalToursByTourType,
    avgStartingCost,
    totalToursByDivision,
    mostBookedTours,
  ] = await Promise.all([
    TourModel.countDocuments(),
    TourModel.aggregate([
      {
        $group: {
          _id: "$tourType",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "tourtypes",
          localField: "_id",
          foreignField: "_id",
          as: "type",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      { $unwind: "$type" },
      { $sort: { "type.name": 1 } },
      {
        $project: {
          _id: 1,
          name: "$type.name",
          count: 1,
        },
      },
    ]),
    TourModel.aggregate([
      {
        $group: {
          _id: null,
          avgStartingCost: { $avg: "$costFrom" },
        },
      },
      {
        $project: {
          _id: 0,
          avgStartingCost: {
            $toDouble: { $round: [{ $toDecimal: "$avgStartingCost" }, 2] },
          },
        },
      },
    ]),
    TourModel.aggregate([
      {
        $group: {
          _id: "$division",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "divisions",
          localField: "_id",
          foreignField: "_id",
          as: "type",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      { $unwind: "$type" },
      { $sort: { "type.name": 1 } },
      {
        $project: {
          _id: 1,
          name: "$type.name",
          count: 1,
        },
      },
    ]),
    BookingModel.aggregate([
      {
        $group: {
          _id: "$tour",
          bookingCount: { $sum: 1 },
        },
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "tours",
          localField: "_id",
          foreignField: "_id",
          as: "tour",
          pipeline: [{ $project: { title: 1 } }],
        },
      },
      { $unwind: "$tour" },
      {
        $project: {
          title: "$tour.title",
          bookingCount: 1,
        },
      },
    ]),
  ]);

  return {
    totalTours,
    totalToursByTourType,
    avgStartingCost: avgStartingCost[0]?.avgStartingCost ?? 0,
    totalToursByDivision,
    mostBookedTours,
  };
};

const getUserStatsFromDB = async () => {
  const sevenDaysAgo = getDaysAgo(7);
  const thirtyDaysAgo = getDaysAgo(30);

  const [
    totalUsers,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    totalUsersByRole,
    newUsersInLastSevenDays,
    newUsersInLastThirtyDays,
  ] = await Promise.all([
    UserModel.countDocuments(),
    UserModel.countDocuments({
      isActive: UserStatus.Active,
    }),
    UserModel.countDocuments({
      isActive: UserStatus.Inactive,
    }),
    UserModel.countDocuments({
      isActive: UserStatus.Blocked,
    }),
    UserModel.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]),
    UserModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    }),
    UserModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    }),
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    totalUsersByRole,
    newUsersInLastSevenDays,
    newUsersInLastThirtyDays,
  };
};

export const StatsServices = {
  getBookingStatsFromDB,
  getPaymentStatsFromDB,
  getTourStatsFromDB,
  getUserStatsFromDB,
};
