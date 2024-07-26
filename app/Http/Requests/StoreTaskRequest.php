<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'titulo' => 'required|string|max:55|unique:tasks,titulo',
            'descripcion' => 'required|string',
            'fecha' => 'required|string',
            'estado' => 'required|string',
            'prioridad' => 'string',
            'email' => 'string',
        ];
    }
}
