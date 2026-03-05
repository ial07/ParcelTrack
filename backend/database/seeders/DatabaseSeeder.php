<?php

namespace Database\Seeders;

use App\Enums\ParcelStatus;
use App\Models\Courier;
use App\Models\Parcel;
use App\Models\ParcelStatusHistory;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@parceltrack.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        // Warehouses
        $warehouses = collect([
            ['name' => 'Jakarta Main Hub', 'code' => 'WH-JKT-01', 'address' => 'Jl. Sudirman No. 1', 'city' => 'Jakarta', 'province' => 'DKI Jakarta', 'postal_code' => '10210'],
            ['name' => 'Surabaya Distribution Center', 'code' => 'WH-SBY-01', 'address' => 'Jl. Raya Darmo No. 55', 'city' => 'Surabaya', 'province' => 'Jawa Timur', 'postal_code' => '60241'],
            ['name' => 'Bandung Sorting Facility', 'code' => 'WH-BDG-01', 'address' => 'Jl. Asia Afrika No. 10', 'city' => 'Bandung', 'province' => 'Jawa Barat', 'postal_code' => '40111'],
            ['name' => 'Bali Express Hub', 'code' => 'WH-DPS-01', 'address' => 'Jl. Bypass Ngurah Rai No. 88', 'city' => 'Denpasar', 'province' => 'Bali', 'postal_code' => '80228'],
            ['name' => 'Yogyakarta Transit Point', 'code' => 'WH-JOG-01', 'address' => 'Jl. Malioboro No. 20', 'city' => 'Yogyakarta', 'province' => 'DI Yogyakarta', 'postal_code' => '55213'],
        ])->map(fn($data) => Warehouse::create(array_merge($data, ['is_active' => true])));

        // Couriers
        $couriers = collect([
            ['name' => 'Ahmad Delivery', 'phone' => '08123456789', 'email' => 'ahmad@courier.com', 'vehicle_type' => 'van'],
            ['name' => 'Budi Express', 'phone' => '08234567890', 'email' => 'budi@courier.com', 'vehicle_type' => 'motorcycle'],
            ['name' => 'Citra Logistics', 'phone' => '08345678901', 'email' => 'citra@courier.com', 'vehicle_type' => 'truck'],
        ])->map(fn($data) => Courier::create(array_merge($data, ['is_active' => true])));

        // Parcels with status histories
        $parcelsData = [
            [
                'sender_name' => 'PT Logistics Indonesia',
                'receiver_name' => 'John Doe',
                'receiver_address' => 'Jl. Sudirman No. 45, Jakarta Pusat',
                'receiver_phone' => '08111222333',
                'weight' => 2.5,
                'description' => 'Electronic components',
                'current_status' => ParcelStatus::IN_TRANSIT->value,
                'estimated_delivery' => '2026-03-10',
                'origin_warehouse_id' => $warehouses[0]->id,
                'destination_warehouse_id' => $warehouses[1]->id,
                'courier_id' => $couriers[0]->id,
                'statuses' => [
                    ['status' => 'PENDING', 'location' => 'Jakarta Main Hub', 'notes' => 'Parcel registered in system'],
                    ['status' => 'PICKED_UP', 'location' => 'Jakarta Main Hub', 'notes' => 'Parcel picked up from sender'],
                    ['status' => 'IN_WAREHOUSE', 'location' => 'Jakarta Main Hub', 'notes' => 'Received at warehouse for processing'],
                    ['status' => 'IN_TRANSIT', 'location' => 'En route to Surabaya', 'notes' => 'Dispatched via land freight'],
                ],
            ],
            [
                'sender_name' => 'Toko Buku Gramedia',
                'receiver_name' => 'Jane Smith',
                'receiver_address' => 'Jl. Diponegoro No. 12, Bandung',
                'receiver_phone' => '08222333444',
                'weight' => 1.0,
                'description' => 'Books and stationery',
                'current_status' => ParcelStatus::DELIVERED->value,
                'estimated_delivery' => '2026-03-07',
                'origin_warehouse_id' => $warehouses[0]->id,
                'destination_warehouse_id' => $warehouses[2]->id,
                'courier_id' => $couriers[1]->id,
                'statuses' => [
                    ['status' => 'PENDING', 'location' => 'Jakarta Main Hub', 'notes' => 'Parcel registered'],
                    ['status' => 'PICKED_UP', 'location' => 'Jakarta', 'notes' => 'Picked up from store'],
                    ['status' => 'IN_WAREHOUSE', 'location' => 'Jakarta Main Hub', 'notes' => 'Processing'],
                    ['status' => 'IN_TRANSIT', 'location' => 'Jakarta → Bandung', 'notes' => 'On the way'],
                    ['status' => 'OUT_FOR_DELIVERY', 'location' => 'Bandung', 'notes' => 'Last-mile delivery'],
                    ['status' => 'DELIVERED', 'location' => 'Bandung', 'notes' => 'Received by recipient'],
                ],
            ],
            [
                'sender_name' => 'Shopee Seller',
                'receiver_name' => 'Andi Pratama',
                'receiver_address' => 'Jl. Kuta No. 5, Denpasar, Bali',
                'receiver_phone' => '08333444555',
                'weight' => 0.5,
                'description' => 'Phone accessories',
                'current_status' => ParcelStatus::PENDING->value,
                'estimated_delivery' => '2026-03-12',
                'origin_warehouse_id' => $warehouses[0]->id,
                'destination_warehouse_id' => $warehouses[3]->id,
                'courier_id' => null,
                'statuses' => [
                    ['status' => 'PENDING', 'location' => 'System Origin', 'notes' => 'Parcel registered in system'],
                ],
            ],
            [
                'sender_name' => 'Tokopedia Merchant',
                'receiver_name' => 'Siti Rahayu',
                'receiver_address' => 'Jl. Malioboro No. 8, Yogyakarta',
                'receiver_phone' => '08444555666',
                'weight' => 3.2,
                'description' => 'Clothing and fashion items',
                'current_status' => ParcelStatus::OUT_FOR_DELIVERY->value,
                'estimated_delivery' => '2026-03-06',
                'origin_warehouse_id' => $warehouses[1]->id,
                'destination_warehouse_id' => $warehouses[4]->id,
                'courier_id' => $couriers[2]->id,
                'statuses' => [
                    ['status' => 'PENDING', 'location' => 'Surabaya', 'notes' => 'Registered'],
                    ['status' => 'PICKED_UP', 'location' => 'Surabaya DC', 'notes' => 'Picked up'],
                    ['status' => 'IN_WAREHOUSE', 'location' => 'Surabaya DC', 'notes' => 'Processing'],
                    ['status' => 'IN_TRANSIT', 'location' => 'Surabaya → Yogya', 'notes' => 'En route'],
                    ['status' => 'OUT_FOR_DELIVERY', 'location' => 'Yogyakarta', 'notes' => 'Out for delivery'],
                ],
            ],
        ];

        foreach ($parcelsData as $parcelData) {
            $statuses = $parcelData['statuses'];
            unset($parcelData['statuses']);

            $parcelData['tracking_number'] = 'PT-' . strtoupper(Str::random(8));
            $parcel = Parcel::create($parcelData);

            foreach ($statuses as $i => $statusData) {
                ParcelStatusHistory::create(array_merge($statusData, [
                    'parcel_id' => $parcel->id,
                    'changed_by' => $admin->id,
                    'created_at' => now()->subDays(count($statuses) - $i),
                ]));
            }
        }
    }
}
