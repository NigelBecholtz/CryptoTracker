<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('wallet_balance', 10, 2)->default(1000.00);
        });

        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('crypto_symbol');
            $table->decimal('amount', 10, 2);
            $table->decimal('quantity', 16, 8);
            $table->decimal('purchase_price', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('wallet_balance');
        });
        
        Schema::dropIfExists('investments');
    }
};