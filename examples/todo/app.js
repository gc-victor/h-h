import { app } from '../src/app.js';
import { TodoApp } from './todo.js';

app(document.getElementById('container'), TodoApp());
