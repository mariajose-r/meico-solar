<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        //titulo, descripción, fecha limite, estado (pendiente, en progreso, completada), prioridad (opcional)
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'descripcion' => $this->descripcion,
            'fecha' => $this->fecha->format('d-m-Y'),
            'estado' => $this->estado,
            'prioridad' => $this->prioridad,
        ];
    }
}
