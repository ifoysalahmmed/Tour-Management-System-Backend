import { UserStatus } from "../user/user.interface.js";
import { UserModel } from "../user/user.model.js";

const today = new Date();
const sevenDaysAgo = new Date(today).setDate(today.getDate() - 7);
const thirtyDaysAgo = new Date(today).setDate(today.getDate() - 30);

const getBookingStatsFromDB = async () => {};

const getPaymentStatsFromDB = async () => {};

const getTourStatsFromDB = async () => {};

const getUserStatsFromDB = async () => {
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
          count: {
            $sum: 1,
          },
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
