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
        // Add admin_id to orders
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('admin_id')->after('id')->nullable()->constrained('admins')->onDelete('cascade');
        });

        // Add admin_id to services
        Schema::table('services', function (Blueprint $table) {
            $table->foreignId('admin_id')->after('id')->nullable()->constrained('admins')->onDelete('cascade');
        });

        // Add admin_id to settings and update unique constraint
        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique('settings_key_unique');
            $table->foreignId('admin_id')->after('id')->nullable()->constrained('admins')->onDelete('cascade');
            $table->unique(['admin_id', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique(['admin_id', 'key']);
            $table->dropForeign(['admin_id']);
            $table->dropColumn('admin_id');
            $table->unique('key');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropForeign(['admin_id']);
            $table->dropColumn('admin_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['admin_id']);
            $table->dropColumn('admin_id');
        });
    }
};
