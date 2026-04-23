<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->string('status')->default('lead')->change(); 

            $table->string('source_platform')->nullable()->after('channel_id');

            $table->integer('test_score')->nullable()->after('prodi_interest');

            $table->string('payment_proof')->nullable()->after('test_score');

            $table->text('admin_note')->nullable()->after('notes');
        });
    }

    public function down()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn(['source_platform', 'test_score', 'payment_proof', 'admin_note']);
        });
    }
};