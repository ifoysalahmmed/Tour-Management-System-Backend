import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import { DivisionModel } from "../division/division.model.js";
import { TourTypeModel } from "../tour-type/tourType.model.js";
import type { IGetAllToursQuery, ITour } from "./tour.interface.js";
import { TourModel } from "./tour.model.js";

const createTourIntoDB = async (payload: Partial<ITour>) => {
  const { division, tourType } = payload as ITour;

  const isDivisionExists = await DivisionModel.exists({ _id: division });

  if (!isDivisionExists) {
    throw new AppError(status.NOT_FOUND, "Invalid division ID");
  }

  const isTourTypeExists = await TourTypeModel.exists({ _id: tourType });

  if (!isTourTypeExists) {
    throw new AppError(status.NOT_FOUND, "Invalid tour type ID");
  }

  return await TourModel.create(payload);
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

const updateTourIntoDB = async (id: string, payload: Partial<ITour>) => {
  const targetTour = await TourModel.findById(id);

  if (!targetTour) {
    throw new AppError(status.NOT_FOUND, "Tour not found");
  }

  if (payload.division) {
    const isDivisionExists = await DivisionModel.exists({
      _id: payload.division,
    });

    if (!isDivisionExists) {
      throw new AppError(status.NOT_FOUND, "Invalid division ID");
    }
  }

  if (payload.tourType) {
    const isTourTypeExists = await TourTypeModel.exists({
      _id: payload.tourType,
    });

    if (!isTourTypeExists) {
      throw new AppError(status.NOT_FOUND, "Invalid tour type ID");
    }
  }

  if (payload.endDate) {
    const startDate = payload.startDate ?? targetTour.startDate;
    const endDate = payload.endDate;

    if (startDate && endDate < startDate) {
      throw new AppError(
        status.BAD_REQUEST,
        "End date cannot be before start date",
      );
    }
  }

  return await TourModel.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteTourFromDB = async (id: string) => {
  const targetTour = await TourModel.findById(id);

  if (!targetTour) {
    throw new AppError(status.NOT_FOUND, "Tour not found");
  }

  return await TourModel.findByIdAndDelete(id);
};

export const TourServices = {
  createTourIntoDB,
  getAllToursFromDB,
  updateTourIntoDB,
  deleteTourFromDB,
};
