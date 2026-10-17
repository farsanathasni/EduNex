import { relations } from "drizzle-orm/relations";
import {  departments, clubs, clubMemberships, events, eventApprovals, attendance, resources, announcements, studyGroups, studyGroupMembers, notifications } from "./schema";
import { user } from "../src/db/schema/auth-schema";







export const clubsRelations = relations(clubs, ({one, many}) => ({
	department: one(departments, {
		fields: [clubs.departmentId],
		references: [departments.id]
	}),
	clubMemberships: many(clubMemberships),
	events: many(events),
}));

export const departmentsRelations = relations(departments, ({many}) => ({
	clubs: many(clubs),
	resources: many(resources),
	announcements: many(announcements),
	studyGroups: many(studyGroups),
}));

export const clubMembershipsRelations = relations(clubMemberships, ({one}) => ({
	club: one(clubs, {
		fields: [clubMemberships.clubId],
		references: [clubs.id]
	}),
}));

export const eventsRelations = relations(events, ({one, many}) => ({
	club: one(clubs, {
		fields: [events.clubId],
		references: [clubs.id]
	}),
	eventApprovals: many(eventApprovals),
	attendances: many(attendance),
}));

export const eventApprovalsRelations = relations(eventApprovals, ({one}) => ({
	event: one(events, {
		fields: [eventApprovals.eventId],
		references: [events.id]
	}),
}));

export const attendanceRelations = relations(attendance, ({one}) => ({
	event: one(events, {
		fields: [attendance.eventId],
		references: [events.id]
	}),
}));

export const resourcesRelations = relations(resources, ({one}) => ({
	department: one(departments, {
		fields: [resources.departmentId],
		references: [departments.id]
	}),
}));

export const announcementsRelations = relations(announcements, ({one}) => ({
	department: one(departments, {
		fields: [announcements.departmentId],
		references: [departments.id]
	}),
}));

export const studyGroupsRelations = relations(studyGroups, ({one, many}) => ({
	department: one(departments, {
		fields: [studyGroups.departmentId],
		references: [departments.id]
	}),
	studyGroupMembers: many(studyGroupMembers),
}));

export const studyGroupMembersRelations = relations(studyGroupMembers, ({one}) => ({
	studyGroup: one(studyGroups, {
		fields: [studyGroupMembers.studyGroupId],
		references: [studyGroups.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(user, {
		fields: [notifications.userId],
		references: [user.id]
	}),
}));



