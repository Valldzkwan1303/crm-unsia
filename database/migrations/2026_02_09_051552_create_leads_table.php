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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');

            $table->foreignId('channel_id')->nullable()->constrained('channels');
            $table->foreignId('agent_id')->nullable()->constrained('users');

            $table->string('prodi_interest')->nullable();

            $table->enum('status', ['New', 'Contacted', 'Qualified', 'Registered', 'Lost', 'Passive'])->default('New');
            $table->integer('score')->default(0);
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
