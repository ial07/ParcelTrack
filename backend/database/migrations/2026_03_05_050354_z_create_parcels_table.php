<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parcels', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number', 20)->unique();
            $table->string('sender_name');
            $table->string('receiver_name');
            $table->text('receiver_address');
            $table->string('receiver_phone', 20);
            $table->decimal('weight', 8, 2);
            $table->text('description')->nullable();
            $table->string('current_status')->default('PENDING')->index();
            $table->date('estimated_delivery')->nullable();
            
            $table->foreignId('origin_warehouse_id')->constrained('warehouses');
            $table->foreignId('destination_warehouse_id')->constrained('warehouses');
            $table->foreignId('courier_id')->nullable()->constrained('couriers');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parcels');
    }
};
