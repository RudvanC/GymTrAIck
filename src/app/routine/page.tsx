"use client";
import { RoutineList } from "@/components/routine/RoutineList";
import NavbarAuth from "@/components/layout/NavbarAuth";
function ExercisesPage() {
  return (
    <>
      <NavbarAuth />
      <div className="h-screen max-w-7xl mx-auto p-8">
        <RoutineList />
      </div>
    </>
  );
}

export default ExercisesPage;
