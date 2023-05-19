const MissionsModels = require("../../models/todo/task");
const subMissionsModels = require("../../models/todo/subTask");
const url = require('url');
const jsonwebtoken = require("jsonwebtoken");
var userID = null;
// @docs Create a Mission
// @access amdin
// @router public  {{127.0.0.1:5000}}/api/v1/mission/CreateMission
const MissionModel = async (req, res) => {

 // Assuming the token is passed in the Authorization header

  // Verify the token and get the user authentication data
  var user = verifyToken(req);

  const text = req.body.text;
  const idU = user.id;
  const order = req.body.order || null;
  await MissionsModels.create({ text, idU,order })
    .then((deoc) => {
      res.status(200).json({ statusCode: res.statusCode, data: deoc });
    })
    .catch((err) => {
      res.status(301).json({
        statusCode: res.statusCode,
        message: err.message.replace("task validation failed: ", ""),
      });
    });
};
const subMissionModel = async (req, res) => {

  const text = req.body.text;
  // const  idMission  = req.body.idMission;
  const { idMission } = req.params;
  await subMissionsModels.create({ text, idMission })
    .then((deoc) => {
      res.status(200).json({ statusCode: res.statusCode, data: deoc });
    })
    .catch((err) => {
      res.status(301).json({
        statusCode: res.statusCode,
        message: err.message.replace("Tesk validation failed: ", ""),
      });
    });
};
// @docs Get All Missions
// @access public
// @router public  {{127.0.0.1:5000}}/api/v1/mission/GetMission?page=1&limit=1
const getAllMissions = async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const page = queryObject.page * 1 || 1;
  const limit = queryObject.limit * 1 || 15;

  const sortByType = queryObject.sortByType || 1; // created_at
  const sortByDirection = queryObject.sortByDirection || -1; // desc
  var sort = {};
  if (sortByType == 1) {
    sort.created_at = sortByDirection;
  } else if (sortByType == 2) {
    sort.completedOn = sortByDirection;
  } else if (sortByType == 3) {
    sort.order = sortByDirection;
  }
  const skip = (page - 1) * limit;
  var user = verifyToken(req);
  const query = user ? { idU: user.id } : {};

  try {
    const missions = await MissionsModels.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    var missionsArray = [];
    const missionsWithSubMissions = await Promise.all(
        missions.map(async (mission) => {
          const subMissions = await subMissionsModels.find({ idMission: mission._id });

          const resData = {
            _id: mission._id,
            text: mission.text,
            order: mission.order,
            idU: mission.idU,
            status: mission.status,
            completedOn: mission.completedOn,
            created_at: mission.created_at,

            sub_missions: subMissions
          };
          missionsArray.push(resData)
          // const subMissions1 = await subMissionsModels.find({ idMission: mission._id });
          // mission.sub_missions = subMissions1;
          // return mission;
        })
    );

    res.status(200).json({
      result: missionsArray.length,
      page,
      statusCode: res.statusCode,
      data: missionsArray,
    });
  } catch (err) {
    res.status(301).json({
      statusCode: res.statusCode,
      message: err.message.replace("Tesk validation failed: ", ""),
    });
  }
};

// @docs  gitMissionById
// @access public
// @router public  127.0.0.1:5000/api/v1/mission/GetMissionSingle/6443f8bb75f2b26c2df0e2c5
var missions = [];
// const getAllMissionsResource = async (mission) => {
//   var missions = []; // Declare the array inside the function
//   for (let i = 0; i < mission.length; i++) {
//     var data = await MissionsModels.findById(mission[i]._id);
//     var subMissions = await subMissionsModels.find({ idMission: mission[i]._id });
//
//     var resData = {
//       _id: data._id,
//       title: data.text,
//       order: data.order,
//       idU: data.idU,
//       status: data.status,
//       completedOn: data.completedOn,
//       created_at: data.created_at,
//       sub_missions: subMissions
//     };
//     missions.push(resData);
//   }
//   return missions;
// };

const gitMissionById = async (req, res) => {
  const { id } = req.params;
  var data = await MissionsModels.findById(id);
  if (!data) {
    res.status(404).json({ message: `Mission not found by id : ${id}` });
  } else {
    
    const subMissions = await subMissionsModels.find({ idMission: id });

    const resData = {
      _id: data._id,
      title: data.text,
      order: data.order,
      idU: data.idU,
      status: data.status,
      completedOn: data.completedOn,
      created_at: data.created_at,
    
      sub_missions: subMissions
    };
    res.status(200).json(resData);
  }
};
const getSubMissionById = async (req, res) => {
  const { id } = req.params;
  const data = await subMissionsModels.findById(id);
  if (!data) {
    res.status(404).json({ message: `sub Mission not found by id : ${id}` });
  } else {
    res.status(200).json({ data: data });
  }
};
// @docs  deleteMissionById
// @access public
// @router public  127.0.0.1:5000/api/v1/mission/DeleteMissionById/6443f8bb75f2b26c2df0e2c5
const deleteMissionById = async (req, res) => {
  const { id } = req.params;
  await MissionsModels.findByIdAndDelete(id).then((docs) => {
    res.status(200).json({ data: docs ,message: `Success Deleted Mission By ${id}` });
  }).catch(err => {
    res.status(404).json({ message: `Mission not found by id : ${id}` });
  });
};
const deleteSubMissionById = async (req, res) => {
  const { id } = req.params;
  await subMissionsModels.findByIdAndDelete(id).then((docs) => {
    res.status(200).json({ data: docs ,message: `Success Deleted Mission By ${id}` });
  }).catch(err => {
    res.status(404).json({ message: `sub Mission not found by id : ${id}` });
  });
};
// @docs  Update mission
// @access public
// @router public  127.0.0.1:5000/api/v1/mission/UpdateMissionById/6443f8bb75f2b26c2df0e2c5

const UpdateMissionById = async (req, res) => {
  const {id} = req.params
  const text = req.body.text
  var status = req.body.status
  if(status === undefined){
    status = false
  }
  if(status){
    var subMissions = await subMissionsModels.find({ idMission: id });
    const isCompleted = subMissions.every(submission => submission.completedOn !== null);

    if (!isCompleted) {
     return  res.status(400).json({ message: `Mission not Completed` });
    } 
  }
  const result =  await MissionsModels.findOneAndUpdate({_id:id},{
    text:text,
    status:status,
    completedOn: new Date(),

  },
    {
      new:true,
    })
  if (!result) {  
    res.status(404).json({ message: `Mission not found By id : ${id}` });
  } else {
    res.status(200).json({message:`Success Updated Missaion By id : ${id}`, data: result });
  }
}
const UpdateSubMissionById = async (req, res) => {
  const {id} = req.params
  const text = req.body.text
  var status = req.body.status
  if(status === undefined){
    status = false
  }
  var data = {
    text:text,
    status:status,
  }
  if(req.body.completedOn){
    data.completedOn = req.body.completedOn
  }
  const result =  await subMissionsModels.findOneAndUpdate({_id:id},data,
    {
      new:true,
    })
  if (!result) {  
    res.status(404).json({ message: `Sub Mission not found By id : ${id}` });
  } else {
    res.status(200).json({message:`Success Updated Sub Missaion By id : ${id}`, data: result });
  }
}

const getCompletedMission = async(req,res)=>{
  try{
    const tasks = await MissionsModels.find();
  const completedTasks = tasks.filter(task => task.status)
  const percentage = (completedTasks.length / tasks.length) *100;
  res.send({percentage,completedTasks});
  }catch(error){
    res.status(404).json({message:'not found'});
  }
}


const dateFunction = (date) =>{
   const day = date.getDate();
    const month = date.getMonth() +1 ;
    const year = date.getFullYear();
    const fullDate = `${day}-${month}-${year}`;
    return fullDate;
}

const getDailyAch = async(req,res)=>{
  try{
    const tasks = await MissionsModels.find();
    const completedTasks = tasks.filter(task => task.status)
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() +1 ;
    const year = date.getFullYear();
    const fullDate = `${day}-${month}-${year}`;
    const daytasks = completedTasks.filter((task)=> dateFunction(task.completedOn)==fullDate);
    const dailyACh = (daytasks.length / tasks.length) * 100;
    res.status(200).json({data:dailyACh})
    
  }catch(error){
    res.status(404).json({message:error});
  }
}
const verifyToken = (req) => {
  var tokenn = req.headers.authorization;
   tokenn = tokenn.split(" ")[1];
  try {
    // Verify the token using the secret key
     return  jsonwebtoken.verify(tokenn, process.env.SECRET_KEY);

  } catch (error) {
    // If the token is invalid or expired, an error will be thrown
    return null;
  }
};
module.exports = {
  createTask: MissionModel,
  createSubTask: subMissionModel,
  getAllMissions: getAllMissions,
  gitMissionById: gitMissionById,
  getSubMissionById: getSubMissionById,
  deleteMissionById: deleteMissionById,
  deleteSubMissionById: deleteSubMissionById,
  UpdateMissionById: UpdateMissionById,
  UpdateSubMissionById: UpdateSubMissionById,
  getCompletedMission,
  getDailyAch
};
