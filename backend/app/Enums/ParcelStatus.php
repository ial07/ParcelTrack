<?php

namespace App\Enums;

enum ParcelStatus: string
{
    case PENDING = 'PENDING';
    case PICKED_UP = 'PICKED_UP';
    case IN_WAREHOUSE = 'IN_WAREHOUSE';
    case IN_TRANSIT = 'IN_TRANSIT';
    case OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY';
    case DELIVERED = 'DELIVERED';
    case RETURNED = 'RETURNED';
    case CANCELLED = 'CANCELLED';
}
