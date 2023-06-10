import {TasksStateType} from '../App';
import {AddTodolistActionType, GetTodolistsActionType, RemoveTodolistActionType} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from './store';

type ActionsType =
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | GetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>


const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

};

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.toDoListId]:
                    state[action.payload.toDoListId].filter(t => t.id !== action.payload.taskId)
            };
        }
        case 'SET-TASKS': {
            return {...state, [action.payload.toDoListId]: action.payload.tasks};
        }
        case 'SET-TODO-LISTS': {
            let stateCopy = {...state};
            action.payload.toDoList.forEach((td) => {
                stateCopy[td.id] = [];
            });
            return stateCopy;
        }
        case 'ADD-TASK': {
            return {...state, [action.payload.todolistId]: [action.payload.task, ...state[action.payload.todolistId]]};
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map((t) => t.id === action.payload.taskId
                        ? {...t, status: action.payload.status} : t)
            };
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map((t) => t.id === action.payload.taskId
                        ? {...t, title: action.payload.title}
                        : t)
            };
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            };
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
};
export const addTaskAC = (task: TaskType, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {task, todolistId}
    } as const;
};
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {status, todolistId, taskId}
    } as const;
};
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {title, todolistId, taskId}
    } as const;
};
export const setTasksAC = (toDoListId: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASKS',
        payload: {toDoListId, tasks}
    } as const;
};
export const removeTaskAC = (toDoListId: string, taskId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {toDoListId, taskId}
    } as const;
};
export const getTaskTC = (toDoListID: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(toDoListID)
        .then((res) => {
            dispatch(setTasksAC(toDoListID, res.data.items));
        });
};
export const removeTaskTC = (toDoListID: string, taskId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(toDoListID, taskId)
        .then((res) => {
            dispatch(removeTaskAC(toDoListID, taskId));
        });
};
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item, todolistId));
        });
};

export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find((t) => t.id === taskId);

    if (task) {
        const model: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status
        };
        todolistsAPI.updateTask(todolistId, taskId, model)
            .then((res) => {
                dispatch(changeTaskStatusAC(taskId, status, todolistId));
            });
    }
};

export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find((t) => t.id === taskId);

    if (task) {
        const model: UpdateTaskModelType = {
            title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status
        };
        todolistsAPI.updateTask(todolistId, taskId, model)
            .then((res) => {
                dispatch(changeTaskTitleAC(taskId, title, todolistId));
            });
    }
};
