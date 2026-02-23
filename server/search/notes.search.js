import noteModel from "../models/noteModel.js";

const NOTE_USER_POPULATE = { path: "user", select: "name email profileImg" };

export const searchNotes = async ({ q = "", page = 1, limit = 10, sort = "relevance" }) => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Math.min(Number(limit) || 10, 50);
  const query = String(q || "").trim();

  const filter = query
    ? {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { subject: { $regex: query, $options: "i" } },
          { branch: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { tags: { $elemMatch: { $regex: query, $options: "i" } } },
        ],
      }
    : {};

  const sortObj = sort === "date" ? { createdAt: -1 } : { createdAt: -1 };
  const skip = (safePage - 1) * safeLimit;

  const [notes, total] = await Promise.all([
    noteModel.find(filter).sort(sortObj).skip(skip).limit(safeLimit).populate(NOTE_USER_POPULATE).lean(),
    noteModel.countDocuments(filter),
  ]);

  return { success: true, notes, page: safePage, limit: safeLimit, total, source: "mongodb" };
};
