<?php

namespace App\Http\Requests\Parcel;

use Illuminate\Foundation\Http\FormRequest;

class StoreParcelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sender_name' => ['required', 'string', 'max:255'],
            'receiver_name' => ['required', 'string', 'max:255'],
            'receiver_address' => ['required', 'string'],
            'receiver_phone' => ['required', 'string', 'max:20'],
            'weight' => ['required', 'numeric', 'min:0.1'],
            'description' => ['nullable', 'string'],
            'origin_warehouse_id' => ['required', 'exists:warehouses,id'],
            'destination_warehouse_id' => ['required', 'exists:warehouses,id'],
            'courier_id' => ['nullable', 'exists:couriers,id'],
            'estimated_delivery' => ['nullable', 'date'],
        ];
    }
}
