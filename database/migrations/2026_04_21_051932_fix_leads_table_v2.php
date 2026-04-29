<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'registration_code')) {
                $table->string('registration_code')->unique()->nullable()->after('id');
            }
            if (!Schema::hasColumn('leads', 'source_platform')) {
                $table->string('source_platform')->nullable()->after('channel_id');
            }
            if (!Schema::hasColumn('leads', 'registration_fee_proof')) {
                $table->string('registration_fee_proof')->nullable()->after('status');
            }
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
