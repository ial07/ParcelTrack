<?php

namespace Database\Factories;

use App\Models\ParcelStatusHistory;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParcelFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tracking_number' => 'PT-' . strtoupper($this->faker->bothify('?#?#?#?#')),
            'sender_name' => $this->faker->name(),
            'receiver_name' => $this->faker->name(),
            'receiver_address' => $this->faker->address(),
            'receiver_phone' => $this->faker->phoneNumber(),
            'weight' => $this->faker->randomFloat(2, 0.5, 20),
            'description' => $this->faker->sentence(),
            'current_status' => 'PENDING',
            'origin_warehouse_id' => Warehouse::factory(),
            'destination_warehouse_id' => Warehouse::factory(),
        ];
    }
}
