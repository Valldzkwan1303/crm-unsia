<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaign_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('type'); // bts atau b2b
            $table->string('location_name');
            $table->string('location_slug')->unique();
            $table->integer('total_leads')->default(0);
            $table->timestamps();
        });

        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'location_id')) {
                $table->foreignId('location_id')
                    ->nullable()
                    ->after('channel_id')
                    ->constrained('campaign_locations')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            if (Schema::hasColumn('leads', 'location_id')) {
                $table->dropForeign(['location_id']);
                $table->dropColumn('location_id');
            }
        });

        Schema::dropIfExists('campaign_locations');
    }
};