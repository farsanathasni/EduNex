import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { getActiveHod } from "../hod/hod.service.js";
import {createClub,createMemberShipRequest,getAllClubs, getClubAnnouncements, getClubById, getClubCoordinators, getClubEvents, getMyMembershipRequests, getStudentProfileByUserId,} from "./clubs.service.js";
import { createClubSchema } from "./clubs.validation.js";




export const CreateClub = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = createClubSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid club details.",
        errors: validation.error.flatten(),
      });
    }

    const { name, description, departmentId } = validation.data;

    const club = await createClub(name, description, departmentId);

    return res.status(201).json({
      success: true,
      message: "Club created successfully.",
      data: club,
    });
  },
);




export const GetAllClubs = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await getAllClubs();

    return res.status(200).json({
      success: true,
      message: "Clubs fetched successfully.",
      data,
    });
  },
);




export const GetStudentClubs=asyncHandler(async(_req:Request,res:Response)=>{
  const data=await getAllClubs()

  return res.status(200).json({
    success:true,message:"Clubs fetched successfully.",
    data
  })
})


export const GetStudentClubById =asyncHandler(async(req:Request,res:Response)=>{
  const clubId=Number(req.params.clubId)

  if(!Number.isInteger(clubId)||clubId <=0){
    return res.status(400).json({
      success:false,message:"Invalid club ID.",
    })
  }

  const data=await getClubById(clubId)

  if(!data){
    return res.status(404).json({
      success:false,message:"Club not found."
    })
  }

  return res.status(200).json({
    success:true,message:"Club fetched successfully.",
    data
  })
})



export const GetStudentClubCoordinators = asyncHandler(
  async (req: Request, res: Response) => {
    const clubId = Number(req.params.clubId);

    if (!Number.isInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      })
    }

    const data = await getClubCoordinators(clubId);

    return res.status(200).json({
      success: true,
      message: "Club coordinators fetched successfully.",
      data,
    })
  });



export const GetStudentClubEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const clubId = Number(req.params.clubId);

    if (!Number.isInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    const data = await getClubEvents(clubId);

    return res.status(200).json({
      success: true,
      message: "Club events fetched successfully.",
      data,
    });
  })



export const GetStudentClubAnnouncements = asyncHandler(
  async (req: Request, res: Response) => {
    const clubId = Number(req.params.clubId);

    if (!Number.isInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    const data = await getClubAnnouncements(clubId);

    return res.status(200).json({
      success: true,
      message: "Club announcements fetched successfully.",
      data,
    });
  })




export const CreateStudentMembershipRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const clubId = Number(req.params.clubId);

    if (!Number.isInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    const student = await getStudentProfileByUserId(currentUser.id);

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    try {
      const data = await createMemberShipRequest(clubId, student.id);

      return res.status(201).json({
        success: true,
        message: "Membership request submitted successfully.",
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "CLUB_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Club not found.",
        });
      }

      if (
        error instanceof Error &&
        error.message === "MEMBERSHIP_REQUEST_EXISTS"
      ) {
        return res.status(409).json({
          success: false,
          message: "You have already requested or joined this club.",
        });
      }

      throw error;
    }
  },
);




export const GetMyStudentMembershipRequests = asyncHandler(
  async (_req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const student = await getStudentProfileByUserId(currentUser.id);

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    const data = await getMyMembershipRequests(student.id);

    return res.status(200).json({
      success: true,
      message: "Membership requests fetched successfully.",
      data,
    });
  },
);
