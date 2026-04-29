<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'test_score')) {
                $table->integer('test_score')->nullable()->after('status');
            }

            if (!Schema::hasColumn('leads', 'test_results')) {
                $table->json('test_results')->nullable()->after('test_score');
            }
        });
    }

    public function down()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn(['test_score', 'test_results']);
        });
    }
};
