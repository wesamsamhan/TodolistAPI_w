const express = require("express");
const service_todo = require("../services/task/TaskController");
const { checkAuthentication } = require("../passport-options");

const router = express.Router();

router.post("/CreateMission", checkAuthentication, service_todo.createTask);
router.post(
  "/CreateSubMissions/:idMission",
  checkAuthentication,
  service_todo.createSubTask
);
router.get("/GetMission", checkAuthentication, service_todo.getAllMissions);
router.get(
  "/GetMissionSingle/:id",
  checkAuthentication,
  service_todo.gitMissionById
);
router.get(
  "/GetSubMissionSingle/:id",
  checkAuthentication,
  service_todo.getSubMissionById
);
router.delete(
  "/DeleteMissionById/:id",
  checkAuthentication,
  service_todo.deleteMissionById
);
router.delete(
  "/DeleteSubMissionById/:id",
  checkAuthentication,
  service_todo.deleteSubMissionById
);
router.post(
  "/UpdateMissionById/:id",
  checkAuthentication,
  service_todo.UpdateMissionById
);
router.post(
  "/UpdateSubMissionById/:id",
  checkAuthentication,
  service_todo.UpdateSubMissionById
);
router.get(
  "/completeMission",
  checkAuthentication,
  service_todo.getCompletedMission
);
router.get("/dailyAchi", checkAuthentication, service_todo.getDailyAch);

module.exports = router;
