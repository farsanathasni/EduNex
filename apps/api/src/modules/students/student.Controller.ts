import { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { studentService } from "./student.service.js";



export const CreateStudentProfile=asyncHandler(async(req:Request,res:Response)=>{
  const user=res.locals.user

  if(!user){
    return res.status(401).json({
      success: false,message: "Unauthorized. Please log in.",
    })
  }

  const{admissionNumber,departmentId,semester,phone}=req.body

  if(
    typeof user.name!=="string"||!user.name.trim()||
     typeof admissionNumber!=="string"||!admissionNumber.trim()
    ){
      return res.status(400).json({
        success: false, message: "Name and admission number are required.",
      })
     }

     const parseDepartmentId=
     departmentId==null||departmentId===""?null:Number(departmentId)

     const parseSemester=
     semester==null||semester===""?null:Number(semester)

     if (
      (parseDepartmentId !== null &&
        (!Number.isSafeInteger(parseDepartmentId) ||
          parseDepartmentId <= 0)) ||
      (parseSemester !== null &&
        (!Number.isInteger(parseSemester) ||
          parseSemester <= 0))
    ) {
      return res.status(400).json({
        success: false,message: "Invalid department ID or semester.",
      });
    }

    if(phone !==null&&typeof phone!=="string"){
      return res.status(400).json({success:false,message:"Phone must be a string.",})
    }


    const result=await studentService.createProfile({
      userId: user.id,
      name: user.name.trim(),
      admissionNumber: admissionNumber.trim(),
      departmentId: parseDepartmentId,
      semester: parseSemester,
      phone: phone?.trim() || null,
    })

    if (result.alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Student profile already exists.",
        data: result.student,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Student profile created successfully.",
      data: result.student,
    });

})



export const GetStudentProfile= asyncHandler(async(_req:Request,res:Response)=>{
  const user=res.locals.user

  if(!user){
    return res.status(401).json({
      success: false,message: "Unauthorized. Please log in.",
    }) 
  }

  const student=await studentService.getProfile(user.id)

  if(!student){
    return res.status(404).json({
      success: false,message: "Student profile not found.",
    })
  }

  return res.status(200).json({
    success:true,message:"Student profile fetched successfully",
    data:student
  })

})