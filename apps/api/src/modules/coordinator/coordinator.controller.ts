import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { getCoordinatorStatus } from "./coordinator.service.js";



export const getCoordinatorStatusController =asyncHandler(async(
    req:Request,res:Response
)=>{
    const userId=res.locals.user?.id

    if(!userId){
        return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result=await getCoordinatorStatus(userId)
    return res.status(200).json({
      success: true,
      data: result,
    });


})