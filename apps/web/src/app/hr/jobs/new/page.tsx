import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Quiz } from "@/models/Quiz";
import { JobForm } from "./form";
import mongoose from "mongoose";

export default async function NewJobPage() {
  const user = await requireRole(["HR", "COMPANY_ADMIN"]);
  await dbConnect();
  const quizzes = await Quiz.find({ companyId: new mongoose.Types.ObjectId(user.companyId) }).lean();
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold">Post a job</h1>
      <JobForm quizzes={JSON.parse(JSON.stringify(quizzes))} />
    </div>
  );
}
