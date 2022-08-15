import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import axios from "./axiosConfig";
import "./App.css";
import { Card, CardHeader, CardContent, Grid, IconButton, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

function App() {
    const [groups, setGroups] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [newTaskName, setNewTaskName] = useState("");

    const deleteGroupHandler = (groupId: number) => {
        axios
            .delete("/groups", {
                data: {
                    id: groupId,
                },
            })
            .then((response) => {
                refreshGroupsAndTasks();
            });
    };

    const deleteTaskHandler = (taskId: number, groupId: number) => {
        axios
            .delete("/tasks", {
                data: {
                    id: taskId,
                    groupDto: {
                        id: groupId,
                    },
                },
            })
            .then((response) => {
                refreshGroupsAndTasks();
            });
    };

    const saveNewGroupHandler = () => {
        const group = {
            name: newGroupName,
            description: newGroupName,
        };
        axios.post("/groups", group).then((response) => {
            refreshGroupsAndTasks();
        });
    };

    const saveNewTaskHandler = (groupId: number) => {
        const task = {
            name: newTaskName,
            body: newTaskName,
            groupDto: {
                id: groupId,
            },
        };
        axios.post("/tasks", task).then((response) => {
            refreshGroupsAndTasks();
        });
    };

    const refreshGroupsAndTasks = () => {
        axios.get("/groups", {}).then((groupResponse) => {
            if (groupResponse) {
                console.log(groupResponse);
                setGroups(groupResponse.data);
            }
        });
        axios.get("/tasks", {}).then((taskResponse) => {
            if (taskResponse) {
                console.log(taskResponse);
                setTasks(taskResponse.data);
            }
        });
    };

    useEffect(() => {
        refreshGroupsAndTasks();
    }, []);

    return (
        <div className="App">
            <AppBar position="static">
                <Typography variant="h5">Trello App</Typography>
            </AppBar>
            <Grid container spacing={2}>
                {groups.map((group) => {
                    return (
                        <Grid item xs={2} key={group.id}>
                            <Card style={{ backgroundColor: "lightgray" }}>
                                <CardHeader
                                    title={group.name ? group.name : group.description}
                                    action={
                                        <IconButton onClick={() => deleteGroupHandler(group.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                ></CardHeader>
                                <CardContent>
                                    {tasks.map((task) => {
                                        if (task.groupDto != null && task.groupDto.id === group.id) {
                                            return (
                                                <Paper style={{ marginBottom: "5px" }}>
                                                    {task.name} - {task.body}{" "}
                                                    <IconButton onClick={() => deleteTaskHandler(task.id, group.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Paper>
                                            );
                                        }
                                    })}
                                    <Paper>
                                        <TextField size="small" placeholder="Add a task..." onChange={(ev) => setNewTaskName(ev.target.value)} />
                                        <IconButton onClick={() => saveNewTaskHandler(group.id)}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Paper>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
                <Grid item xs={2} key="newGroup">
                    <Card style={{ backgroundColor: "lightgray" }}>
                        <CardHeader></CardHeader>
                        <CardContent>
                            <Paper>
                                <TextField size="small" placeholder="Add a group..." onChange={(ev) => setNewGroupName(ev.target.value)} />
                                <IconButton onClick={saveNewGroupHandler}>
                                    <SaveIcon />
                                </IconButton>
                            </Paper>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default App;
