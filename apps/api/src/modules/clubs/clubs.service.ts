
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../config/database.js";
import { announcements, clubMemberships, clubs, events } from "../../db/schema/others-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { user } from "../../db/schema/auth-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";

export const createClub = async (
  name: string,
  description?: string,
  departmentId?: number,
) => {
  const [club] = await db
    .insert(clubs)
    .values({
      name,
      description: description || null,
      departmentId: departmentId ?? null,
    })
    .returning();

  return club;
};


export const getAllClubs = async () => {
  return db.select().from(clubs);
};



export const getClubById = async (clubId: number) => {
  const [club] = await db
    .select()
    .from(clubs)
    .where(eq(clubs.id, clubId))
    .limit(1);

  return club ?? null;
};



export const getClubCoordinators=async(clubId:number)=>{
  return db
  .select({
    studentId:StudentProfile.id,
    name:user.name,
    email:user.email
  })
  .from(coordinatorAssignments)
  .innerJoin(
    StudentProfile,
    eq(coordinatorAssignments.studentId,StudentProfile.id)
  )
  .innerJoin(user,eq(StudentProfile.userId,user.id))
  .where(eq(coordinatorAssignments.clubId,clubId))
}



export const createMemberShipRequest=async(clubId:number,studentId:number)=>{
  const[club]=await db
  .select({id:clubs.id})
  .from(clubs)
  .where(eq(clubs.id,clubId))
  .limit(1)

  if(!club){
    throw new Error("CLUB_NOT_FOUND");
  }

  const [existing]=await db
  .select({
    id:clubMemberships.id,
    status:clubMemberships.status
  })
  .from(clubMemberships)
  .where(and(
    eq(clubMemberships.clubId,clubId),
    eq(clubMemberships.studentId,studentId)
  ))
  .limit(1)

  if(existing){
    throw new Error("MEMBERSHIP_REQUEST_EXISTS");
  }

  const [request] = await db
    .insert(clubMemberships)
    .values({
      clubId,
      studentId,
      status: "pending",
    })
    .returning();

  return request
}



export const getMyMembershipRequests=async(studentId:number)=>{
  return db
  .select({
    id:clubMemberships.id,
    clubId:clubs.id,
    clubName:clubs.name,
    status:clubMemberships.status,
    requestedAt:clubMemberships.requestedAt,
    reviewedAt:clubMemberships.reviewedAt,
  })
  .from(clubMemberships)
  .innerJoin(clubs,eq(clubMemberships.clubId,clubs.id))
  .where(eq(clubMemberships.studentId,studentId))
  .orderBy(desc(clubMemberships.requestedAt))
}


export const getClubEvents=async(clubId:number)=>{
  return db
  .select()
  .from(events)
  .where(and(
    eq(events.clubId,clubId),
    inArray(events.status,["approved","published"])
  ))
  .orderBy(events.startTime)
}


export const getClubAnnouncements =async(clubId:number)=>{
  return db 
  .select()
  .from(announcements)
  .where(and(
    eq(announcements.clubId,clubId),
    eq(announcements.audience,"club")
  ))
  .orderBy(desc(announcements.publishedAt))
}



export const getStudentProfileByUserId = async (userId: string) => {
  const [student] = await db
    .select({
      id: StudentProfile.id,
    })
    .from(StudentProfile)
    .where(eq(StudentProfile.userId, userId))
    .limit(1);

  return student ?? null;
};
