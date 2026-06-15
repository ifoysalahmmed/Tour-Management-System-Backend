import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import { deleteFromCloudinary } from "../../helpers/cloudinary/index.js";
import { TourModel } from "../tour/tour.model.js";
import type { IDivision } from "./division.interface.js";
import { DivisionModel } from "./division.model.js";

const createDivisionIntoDB = async (payload: IDivision) => {
  const session = await DivisionModel.startSession();
  session.startTransaction();

  try {
    const [division] = await DivisionModel.create([payload], { session });

    if (!division) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to create division",
      );
    }

    await session.commitTransaction();
    return division;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllDivisionsFromDB = async () => {
  const [divisions, total] = await Promise.all([
    DivisionModel.find(),
    DivisionModel.countDocuments(),
  ]);

  return {
    divisions,
    total,
  };
};

const getDivisionBySlugFromDB = async (slug: string) => {
  const division = await DivisionModel.findOne({ slug });

  if (!division) {
    throw new AppError(status.NOT_FOUND, "Division not found");
  }

  return division;
};

const updateDivisionIntoDB = async (
  id: string,
  payload: Partial<IDivision>,
) => {
  const targetDivision = await DivisionModel.findById(id);

  if (!targetDivision) {
    throw new AppError(status.NOT_FOUND, "Division not found");
  }

  const session = await DivisionModel.startSession();
  session.startTransaction();

  try {
    if (payload.thumbnail && targetDivision.thumbnail) {
      await deleteFromCloudinary(targetDivision.thumbnail);
    }

    const updatedDivision = await DivisionModel.findByIdAndUpdate(id, payload, {
      returnDocument: "after",
      runValidators: true,
      session,
    });

    if (!updatedDivision) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to update division",
      );
    }

    await session.commitTransaction();
    return updatedDivision;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const deleteDivisionFromDB = async (id: string) => {
  const targetDivision = await DivisionModel.findById(id);

  if (!targetDivision) {
    throw new AppError(status.NOT_FOUND, "Division not found");
  }

  const isUsedInTour = await TourModel.exists({ division: id });

  if (isUsedInTour) {
    throw new AppError(
      status.CONFLICT,
      "Division cannot be deleted because it is associated with one or more tours",
    );
  }

  if (targetDivision.thumbnail) {
    await deleteFromCloudinary(targetDivision.thumbnail);
  }

  return await DivisionModel.findByIdAndDelete(id);
};

export const DivisionServices = {
  createDivisionIntoDB,
  getAllDivisionsFromDB,
  getDivisionBySlugFromDB,
  updateDivisionIntoDB,
  deleteDivisionFromDB,
};
