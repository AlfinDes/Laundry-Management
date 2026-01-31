<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_id')->unique();
            $table->string('customer_name');
            $table->text('customer_address');
            $table->string('customer_phone');
            $table->string('service_type'); // kiloan, satuan, both
            $table->string('order_type'); // pickup, dropoff
            $table->string('status')->default('pending'); // pending, picked_up, washing, ironing, ready, delivered, completed
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('items')->nullable();
            $table->decimal('total_price', 12, 2)->nullable();
            $table->string('payment_status')->default('unpaid'); // unpaid, paid
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
