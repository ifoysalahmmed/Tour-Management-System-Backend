import type { Query } from "mongoose";

import { excludedFields } from "../constant.js";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly queryString: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, queryString: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.queryString = queryString;
  }

  private getPageAndLimit() {
    const page = Math.max(1, Number(this.queryString.page || 1));
    const limit = Math.max(
      1,
      Math.min(100, Number(this.queryString.limit || 10)),
    );

    return { page, limit };
  }

  search(searchableFields: string[]): this {
    const { search } = this.queryString;
    const searchFilter = search
      ? {
          $or: searchableFields.map((field) => ({
            [field]: { $regex: search, $options: "i" },
          })),
        }
      : {};

    this.modelQuery = this.modelQuery.find(searchFilter);
    return this;
  }

  filter(): this {
    const filters = Object.fromEntries(
      Object.entries(this.queryString).filter(
        ([field]) => !excludedFields.includes(field),
      ),
    );

    this.modelQuery = this.modelQuery.find(filters);
    return this;
  }

  sort(): this {
    const sortBy = this.queryString.sort?.split(",").join(" ") ?? "-createdAt";

    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  select(): this {
    const selectedFields = this.queryString.fields?.split(",").join(" ");

    if (selectedFields) {
      this.modelQuery = this.modelQuery.select(selectedFields);
    }
    return this;
  }

  paginate(): this {
    const { page, limit } = this.getPageAndLimit();
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  populate(fields: string): this {
    this.modelQuery = this.modelQuery.populate(fields);
    return this;
  }

  async getMetaData() {
    const { page, limit } = this.getPageAndLimit();
    const total = await this.modelQuery.model
      .find(this.modelQuery.getFilter())
      .countDocuments();

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
