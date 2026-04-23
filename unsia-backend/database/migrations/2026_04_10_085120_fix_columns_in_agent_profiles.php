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
        Schema::table('agent_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('agent_profiles', 'type')) {
                $table->string('type')->default('umum')->after('user_id');
            }
            if (!Schema::hasColumn('agent_profiles', 'nim')) {
                $table->string('nim')->nullable()->after('type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agent_profiles', function (Blueprint $table) {
            //
        });
    }
};
