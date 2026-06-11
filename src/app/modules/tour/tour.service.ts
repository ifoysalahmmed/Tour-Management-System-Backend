import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { DivisionModel } from "../division/division.model.js";
import { TourTypeModel } from "../tour-type/tourType.model.js";
import { tourSearchableFields } from "./tour.constant.js";
import type { TTourCreate, TTourUpdate } from "./tour.interface.js";
import { TourModel } from "./tour.model.js";

const createTourIntoDB = async (payload: Partial<TTourCreate>) => {
  const { division, tourType } = payload as TTourCreate;

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

const getAllToursFromDB = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourModel.find(), query);

  const data = queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .select()
    .paginate()
    .populate("division tourType");

  const [tours, meta] = await Promise.all([
    data.modelQuery,
    queryBuilder.getMetaData(),
  ]);

  return {
    tours,
    meta,
  };
};

const getTourBySlugFromDB = async (slug: string) => {
  const tour = await TourModel.findOne({ slug });

  if (!tour) {
    throw new AppError(status.NOT_FOUND, "Tour not found");
  }

  return tour;
};

const updateTourIntoDB = async (id: string, payload: TTourUpdate) => {
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

  const today = new Date(new Date().setHours(0, 0, 0, 0));

  if (payload.startDate && payload.startDate < today) {
    throw new AppError(status.BAD_REQUEST, "Start date cannot be in the past");
  }

  const startDate = payload.startDate ?? targetTour.startDate;
  const endDate = payload.endDate ?? targetTour.endDate;

  if (startDate && endDate && endDate < startDate) {
    throw new AppError(
      status.BAD_REQUEST,
      "End date cannot be before start date",
    );
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
  getTourBySlugFromDB,
  updateTourIntoDB,
  deleteTourFromDB,
};
