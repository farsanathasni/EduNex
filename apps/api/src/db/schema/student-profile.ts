import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core"
import { user } from "./auth-schema.js"
import { relations } from "drizzle-orm"


export const StudentProfile=pgTable("student-profile",{
  id:bigint("id",{mode:"number"})
  .primaryKey()
  .generatedAlwaysAsIdentity(),

  name:text("name").notNull(),
  
  userId:text("user_id")
  .notNull().unique()
  .references(()=>user.id,{onDelete:"cascade"}),

  admissionNumber:text("admission-number")
  .notNull()
  .unique(),

  departmentId:bigint("department_id",{mode:"number"}),

  semester:integer("semester"),

  phone:text("phone")
})


export const StudentProfileRelation=relations(
  StudentProfile,({one})=>({
    user:one(user,{
      fields:[StudentProfile.userId],
      references:[user.id]
    })
  })
)