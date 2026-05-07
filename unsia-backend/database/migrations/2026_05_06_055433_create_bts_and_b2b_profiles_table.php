<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bts_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('bts_id')->unique();
            $table->string('unit');
            $table->decimal('balance', 15, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('b2b_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('b2b_id')->unique();
            $table->string('department');
            $table->decimal('balance', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bts_profiles');
        Schema::dropIfExists('b2b_profiles');
    }
};