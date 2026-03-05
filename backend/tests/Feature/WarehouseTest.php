<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WarehouseTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_warehouses(): void
    {
        Warehouse::factory()->count(3)->create();
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/admin/warehouses');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'name', 'code', 'city']
                    ],
                    'total',
                ]
            ]);
        
        $this->assertEquals(3, $response->json('data.total'));
    }

    public function test_admin_can_create_warehouse(): void
    {
        $admin = User::factory()->create();

        $payload = [
            'name' => 'Main Hub',
            'code' => 'WH-MAIN',
            'address' => '123 Supply Chain St',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'postal_code' => '12345',
            'is_active' => true,
        ];

        $response = $this->actingAs($admin)
            ->postJson('/api/admin/warehouses', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.code', 'WH-MAIN');
            
        $this->assertDatabaseHas('warehouses', ['code' => 'WH-MAIN']);
    }
}
