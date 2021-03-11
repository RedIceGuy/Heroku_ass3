//Sample for Assignment 3
const express = require('express');

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');

//Use cors to avoid issues with testing on localhost
const cors = require('cors');

const app = express();

//Port environment variable already set up to run on Heroku
var port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());  

//The following is an example of an array of three boards. 
var boards = [
    { id: '0', name: "Planned", description: "Everything that's on the todo list.", tasks: ["0","1","2"] },
    { id: '1', name: "Ongoing", description: "Currently in progress.", tasks: [] },
    { id: '3', name: "Done", description: "Completed tasks.", tasks: ["3"] }
];

var tasks = [
    { id: '0', boardId: '0', taskName: "Another task", dateCreated: new Date(Date.UTC(2021, 00, 21, 15, 48)), archived: false },
    { id: '1', boardId: '0', taskName: "Prepare exam draft", dateCreated: new Date(Date.UTC(2021, 00, 21, 16, 48)), archived: false },
    { id: '2', boardId: '0', taskName: "Discuss exam organisation", dateCreated: new Date(Date.UTC(2021, 00, 21, 14, 48)), archived: false },
    { id: '3', boardId: '3', taskName: "Prepare assignment 2", dateCreated: new Date(Date.UTC(2021, 00, 10, 16, 00)), archived: true }
];

function checkIfArchived(tasksList) {
    for (let i=0; i<tasksList.length; i++) {
        var taskId = tasksList[i];
        for (let j=0; j<tasks.length; j++) {
            if (tasks[j].id === taskId) {
                var thisTask = tasks[j];
                if (thisTask.archived === false) {
                    return false;
                }
            }
        }
    }
    return true;
}
//Your endpoints go here
var BoardID = 4;
var TaskID = 4;

app.get('/api/v1/boards', (req, res) => { // GET all boards  
    return res.status(200).json(boards);
});

app.get('/api/v1/boards/:boardid', (req, res) => { // GET an individual board  
    var boardId = req.params.boardid;
    for (let i=0; i<boards.length; i++) {
        if (boards[i].id == boardId) {
            var ThisBoard = boards[i];
            return res.status(200).json(ThisBoard);
        }
    }
    return res.status(404);
});

app.post('/api/v1/boards/', (req, res) => { // Create new board  
    var boardName = req.body.name;
    var boardDescription = req.body.description;
    if (boardName !== "") {
        var newBoardID = BoardID;
        BoardID++;
        BoardJSON = {id: newBoardID, name: boardName, description: boardDescription, tasks: Array()};
        boards.push(BoardJSON);
        return res.status(201).json(BoardJSON);
    }
    return res.status(400);
});

app.patch('/api/v1/boards/:boardid', (req, res) => { // UPDATE a board
    var newName = req.body.name;
    var newDesc = req.body.description;
    var boardToUpdateID = req.params.boardid;
    for (let i=0; k<boards.length; k++) {
        if (boards[k].id === boardToUpdateID) {
            var boardToUpdate = boards[k];
            if (checkIfArchived(boardToUpdate.tasks) === true) {
                boardToUpdate.name = newName;
                boardToUpdate.description = newDesc;
                return res.status(200).json(boardToUpdate);
            }
        }
    }
    return res.status(400);
});

app.delete('/api/v1/boards/:boardid', (req, res) => { // DELETE a board
    var boardId = req.params.boardid;
    for (let i=0; i<boards.length; i++) {
        if (boards[i].id == boardId) {
            ThisBoard = boards[i];
            for (let j=0; j<ThisBoard.tasks.length; j++) {
                if (tasks[j].archived === false) { 
                    return res.status(400);
                }
            }
        }
    }
    return res.status(200).json(ThisBoard);
});

app.delete('/api/v1/boards/deleteallboards', (req, res) => { // DELETE all boards
    var boardId = req.params.boardid;
    for (let i = 0; i < boards.length; i++) {
        if (boards[i].id == boardId) {
            var ThisBoard = boards[i];
            var tasksList = ThisBoard.tasks;
            var tasksRetList = Array();
            for (let j = 0; j < tasksList.length; j++) { // Iterate through the boards' tasks
                for (let k = 0; k < tasks.length; k++) { // Iterate through all stored tasks
                    if (tasks[k].id === tasksList[j]) { // Find the task which belongs to the board
                        tasksRetList.push(tasks[k])
                    }
                }
            }
            return res.status(200).send(ThisBoard, tasksRetList);
        }
    }
    return res.status(404);
});

app.get('/api/v1/boards/:boardid/tasks', (req, res) => { // GET all tasks  
    var boardId = req.params.boardid;
    for (let i=0; i<boards.length; i++) {
        if (boards[i].id == boardId) {
            var ThisBoard = boards[i];
            var tasksList = ThisBoard.tasks;
            var tasksRetList = Array();
            for (let j=0; j<tasksList.length; j++) { // Iterate through the boards' tasks
                for (let k=0; k<tasks.length; k++) { // Iterate through all stored tasks
                    if (tasks[k].id === tasksList[j]) { // Find the task which belongs to the board
                        tasksRetList.push(tasks[k])
                    }
                }
            }
            return res.status(200).send(tasksRetList);
        }
    }
    return res.status(404);
});

app.get('/api/v1/boards/:boardid/:taskid', (req, res) => {
    var boardId = req.params.boardid;
    var taskId = req.params.taskid;
    for (let i=0; i<boards.length; i++) {
        if (boards[i].id === boardId) { // If board exists
            var ThisBoard = boards[i];
            for (let j=0; j<ThisBoard.tasks.length; j++) {
                if (ThisBoard.tasks[j].id === taskId) { // If taskId belongs to the board
                    for (let k=0; k<tasks.length; k++) {
                        if (tasks[k].id === taskId) {
                            console.log('HOORAY');
                            return res.status(200).json(tasks[k])
                        }
                    }
                }
            }
        }
    }
    return res.status(404);
});

app.post('/api/v1/boards/:boardid/tasks', (req, res) => { // Create new task in board  
    var taskName = req.body.taskName;
    var boardId = req.params.boardid;
    for (let i=0; i<boards.length; i++) {
        var ThisBoard = boards[i];
        if (ThisBoard.id == boardId) {
            var newTaskID = TaskID.toString();
            TaskID++;
            TaskJSON = {id: newTaskID, boardId: boardId, taskName: taskName, dateCreated: Date.now(), archived: false};
            ThisBoard.tasks.push(newTaskID);
            tasks.push(TaskJSON);
            return res.status(201).json(TaskJSON);
        }
    }
    return res.status(400);
});

app.delete('/api/v1/boards/:boardid/tasks/:taskid', (req, res) => { // DELETE a task  
    var taskId = req.params.taskid;
    var boardId = req.params.boardId;
    for (let i=0; i <boards.length; i++) {
        if (boards[i].id === boardId) {
            var ThisBoard = boards[i];
            for (let j=0; j<ThisBoard.tasks.length; j++) {
                if (ThisBoard.tasks[j] === taskId) {
                    ThisBoard.tasks.splice(j, 1);
                    for (let k=0; k<tasks.length; k++) {
                        if (tasks[k].id === taskId) {
                            var TaskJSON = tasks[k];
                            tasks.splice(k, 1);
                            return res.status(200).json(TaskJSON);
                        }
                    }
                }
            }
        }
    }
    return res.status(400);
});

app.patch('/api/v1/boards/:boardid/tasks/:taskid', (req, res) => { // Archive task  
    var taskId = req.params.taskid;
    for (let i=0; i<tasks.length; i++) {
        if (tasks[i].id == taskId) {
            thisTask = tasks[i];
            thisTask.archived = true;
            return res.status(200).json(thisTask);
        }
    }
    return res.status(400);
});

app.patch('/api/v1/boards/:boardid/tasks/:taskid', (req, res) => { // Rename task  
    var taskId = req.params.taskid;
    var newTaskName = req.body.taskName;
    for (let i=0; i<tasks.length; i++) {
        if (tasks[i].id === taskId) {
            var thisTask = tasks[i];
            thisTask.taskName = newTaskName;
            return res.status(200).json(thisTask);
        }
    }
    return res.status(400);
});

app.patch('/api/v1/boards/:boardid/tasks/:taskid', (req, res) => { // Change boardID of a task
    var newBoardID = req.body.boardId;
    var taskId = req.params.taskid;
    for (let i=0; i<tasks.length; i++) {
        var thisTask = tasks[i];
        if (thisTask.id === taskId) {
            var oldBoardID = thisTask.boardId;
            thisTask.boardId = newBoardID; // Update the boardID for the task in the tasks array
            for (let j=0; j<boards.length; j++) {
                var thisBoard = boards[j];
                if (thisBoard.id === oldBoardID) {
                    var taskIndex = thisBoard.tasks.indexOf(taskId);
                    thisBoard.tasks.splice(taskIndex, 1);
                }
                if (thisBoard.id === newBoardID) {
                    thisBoard.tasks.push(taskId);
                }
            }
            return res.status(200).json(thisTask);
        }
    }
    return res.status(400);
});

//Start the server
app.listen(port, () => {
    console.log('Board app listening...');
});