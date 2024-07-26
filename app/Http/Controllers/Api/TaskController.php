<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;
use App\Notifications\TaskPriorityNotification;
use Illuminate\Support\Facades\Notification;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     *
     */
    public function index(Request $request)
    {
        if ($request->estado && !$request->prioridad) {
            $tasks = Task::query()
                ->where('estado', $request->estado)
                ->orderByDesc('id')
                ->paginate(10);
        } elseif ($request->prioridad && !$request->estado) {
            $tasks = Task::query()
                ->where('prioridad', $request->prioridad)
                ->orderByDesc('id')
                ->paginate(10);
        } elseif ($request->prioridad && $request->estado) {
            $tasks = Task::query()
                ->where('estado', $request->estado)
                ->where('prioridad', $request->prioridad)
                ->orderByDesc('id')
                ->paginate(10);
        } else {
            $tasks = Task::query()
                ->orderByDesc('id')
                ->paginate(10);
        }

        return response($tasks, 200);


    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTaskRequest $request)
    {
        
        $data = $request->validated();

        $task = Task::create($data);
        $mail = $task->email;
        if ($task->prioridad === 'alta' && !empty($task->email)) {
            Notification::route('mail', $mail)
                ->notify(new TaskPriorityNotification($task));
        }
        return response(new TaskResource($task), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        return new TaskResource($task);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskRequest  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();

        $task->update($data);
        $mail = $task->email;
        if ($task->prioridad === 'alta' && !empty($task->email)) {
            Notification::route('mail', $mail)
                ->notify(new TaskPriorityNotification($task));
        }
        return new TaskResource($task);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response('', 204);
    }
}
