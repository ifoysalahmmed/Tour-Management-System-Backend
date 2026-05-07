import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import { DivisionModel } from "../division/division.model.js";
import { TourTypeModel } from "../tour-type/tourType.model.js";
import type { IGetAllToursQuery, ITour } from "./tour.interface.js";
import { TourModel } from "./tour.model.js";

const createTourIntoDB = async (payload: Partial<ITour>) => {
  const { title, division, tourType } = payload as ITour;

  const isDivisionExists = await DivisionModel.exists({ _id: division });

  if (!isDivisionExists) {
    throw new AppError(status.NOT_FOUND, "Invalid division ID");
  }

  const isTourTypeExists = await TourTypeModel.exists({ _id: tourType });

  if (!isTourTypeExists) {
    throw new AppError(status.NOT_FOUND, "Invalid tour type ID");
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  const newTour = { ...payload, slug } as ITour;

  return await TourModel.create(newTour);
};

const getAllToursFromDB = async (query: IGetAllToursQuery) => {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.max(1, Math.min(100, query.limit ?? 10));
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const [tours, total] = await Promise.all([
    TourModel.find()
      .populate("division")
      .populate("tourType")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    TourModel.countDocuments(),
  ]);

  return {
    tours,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const TourServices = {
  createTourIntoDB,
  getAllToursFromDB,
};
