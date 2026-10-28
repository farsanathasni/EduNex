import { eq } from "drizzle-orm"
import { db } from "../../config/database.js"
import { StudentProfile } from "../../db/schema/student-profile.js"
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js"


export const getCoordinatorStatus=async(userId:string)=>{
    const [student]=await db 
    .select({id:StudentProfile.id})
    .from(StudentProfile)
    .where(eq(StudentProfile.userId,userId))
    .limit(1)

    if(!student){
        return{
            isCoordinator:false,
            assignments:[]
        }
    }

    const assignments=await db 
    .select({
        id:coordinatorAssignments.id,
        studentId:coordinatorAssignments.studentId,
        clubId: coordinatorAssignments.clubId,
        appointedBy: coordinatorAssignments.appointedBy,
        createdAt: coordinatorAssignments.createdAt,
    })
    .from(coordinatorAssignments)
    .where(eq(coordinatorAssignments.studentId,student.id))

    return{
        isCoordinator:assignments.length>0,
        assignments
    }
}