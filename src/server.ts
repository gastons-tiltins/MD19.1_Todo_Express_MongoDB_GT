import express from 'express';
import {Request, Response} from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(
    bodyparser.urlencoded({
        extended: true,
    }),
);
// app.use(express.json());
app.use(express.json({type: '*/*'}));
app.use(cors({origin: '*'}));

app.get('/', (req: Request, res: Response) => {
    res.send('Application works!');
});

app.listen(3004, () => {
    console.log('Application started on port 3004!');
});

// +++++++++++++++++++++++++++++++ MONGOOSE +++++++++++++++++++++++++++++++++

// Connect to MONGOOSE database
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/TodoDB', () => {
        console.log('Connected to MongoDB!');
    });
}
main().catch((err) => console.log(err));

// Create schema
const TaskSchema = new mongoose.Schema({
    task: String,
    status: Number,
});

const Todo = mongoose.model('Todo', TaskSchema);

app.post('/tasks', function (req, res) {
    var newTask = new Todo({
        task: req.body.task,
        status: req.body.body,
    });

    newTask.save(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send('Data inserted');
        }
    });
});

// Read all records
app.get('/tasks', async (req, res) => {
    const allTasks = await Todo.find();
    return res.status(200).json(allTasks);
});

// DB id single record. Example: http://localhost:3004/tasks/63ef718204f63829c905c8db
// app.get('/tasks/:id', async (req, res) => {
//     const {id} = req.params;
//     const task = await Todo.findById(id);
//     return res.status(200).json(task);
// });

// add task
try {
    app.post('/post', async (req, res) => {
        // console.log(req.body);
        const newTodo = new Todo({...req.body});
        const insertedTask = await newTodo.save();
        return res.status(201).json(insertedTask);
    });
} catch (err) {
    console.log(err);
}

try {
    app.delete('/delete/:id', async (req, res) => {
        const {id} = req.params;
        console.log(req.params);
        const deleteTodo = await Todo.findByIdAndDelete(id);
        return res.status(200).json(deleteTodo);
    });
} catch (err) {
    console.log(err);
}

// app.put('/tasks/:id', async (req, res) => {
//     const {id} = req.params;
//     // console.log(req.params);
//     console.log(req.body);
//     console.log(id);

//     var values = {$set: {task: 'Mickey', status: 1}};
//     try {
//         const update = await Todo.findByIdAndUpdate(
//             {id},
//             {task: 'gastons', Status: 1},
//         );
//         return res.status(200).json(update);
//     } catch (err) {
//         console.log(err);
//     }
//     // const updatedTodo = await Todo.findById(id);
//     // return res.status(200).json(updatedTodo);
// });

app.post('/update', async (req, res) => {
    const id = req.body.id;
    const task = req.body.task;
    const status = req.body.status;
    console.log(id);
    console.log(task);
    console.log(status);
    Todo.findByIdAndUpdate(
        {_id: id},
        {$set: {task: task, status: status}},
        (err) => {
            if (err) {
                console.log(err);
            } else {
                res.send('Data updated');
            }
        },
    );
});

// const filter = { name: 'Jean-Luc Picard' };
// const update = { age: 59 };

// // `doc` is the document _after_ `update` was applied because of
// // `new: true`
// let doc = await Character.findOneAndUpdate(filter, update, {
//   new: true
// });
// doc.name; // 'Jean-Luc Picard'
// doc.age; // 59

// This also works by the way... ADD TASK
// try {
//     app.post('/post', async (req, res) => {
//         res.setHeader('Content-Type', 'application/json');
//         console.log(req.body);
//         const newTodo = new Todo({
//             id: req.body.id,
//             task: req.body.task,
//             status: req.body.status,
//         });
//         const insertedTask = await newTodo.save();
//         return res.status(201).json(insertedTask);
//     });
// } catch (err) {
//     console.log(err);
// }

// PERSONAL NOTES:
