<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaggablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::create('taggables', function (Blueprint $table) {
            $table->bigInteger('tag_id')->nullable(false)->unsigned()->index();
            $table->bigInteger('taggable_id')->nullable(false)->unsigned()->index();
            $table->string('taggable_type')->nullable(false);
            $table->timestamps();

            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade')->onUpdate('cascade');
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('taggables', function (Blueprint $table) {
            $table->dropForeign('taggables_tag_id_foreign');
        });
    }
}
