"use client";
import { RoutineList } from "@/components/routine/RoutineList";
import NavbarAuth from "@/components/layout/NavbarAuth";
function ExercisesPage() {
  return (
    <>
      <NavbarAuth />
      <RoutineList />
    </>
  );
}

export default ExercisesPage;
