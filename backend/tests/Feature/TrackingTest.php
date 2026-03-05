<?php

namespace Tests\Feature;

use App\Models\Parcel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrackingTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_track_existing_parcel(): void
    {
        $parcel = Parcel::factory()->create([
            'tracking_number' => 'PT-TRACKER99'
        ]);
        
        $parcel->statusHistories()->create([
            'status' => 'PENDING',
            'location' => 'Origin Facility',
            'notes' => 'Registered automatically',
        ]);

        $response = $this->getJson('/api/track/PT-TRACKER99');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.tracking_number', 'PT-TRACKER99')
            ->assertJsonPath('data.current_status', 'PENDING');
            
        // Check that relationships are loaded
        $this->assertCount(1, $response->json('data.status_histories'));
        $this->assertNotNull($response->json('data.origin_warehouse'));
    }

    public function test_tracking_nonexistent_parcel_returns_404(): void
    {
        $response = $this->getJson('/api/track/PT-NONEXISTENT');

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Parcel not found');
    }
}
