import { get, post, put, del } from "./api";

export function getMyProfile() {
  return get("/candidate/profile");
}

export function updateMyProfile(data: any) {
  return put("/candidate/updateProfile", data);
}

export function deleteEducation(id: string) {
  return del(`/candidate/education/${id}`);
}

export function deleteExperience(id: string) {
  return del(`/candidate/experiences/${id}`);
}
