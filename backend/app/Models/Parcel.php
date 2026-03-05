<?php

namespace App\Models;

use App\Enums\ParcelStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Parcel extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_number',
        'sender_name',
        'receiver_name',
        'receiver_address',
        'receiver_phone',
        'weight',
        'description',
        'current_status',
        'estimated_delivery',
        'origin_warehouse_id',
        'destination_warehouse_id',
        'courier_id',
    ];

    protected function casts(): array
    {
        return [
            'weight' => 'decimal:2',
            'current_status' => ParcelStatus::class,
            'estimated_delivery' => 'date',
        ];
    }

    public function originWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'origin_warehouse_id');
    }

    public function destinationWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'destination_warehouse_id');
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ParcelStatusHistory::class);
    }
}
