<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Contracts\ParcelRepositoryInterface::class,
            \App\Repositories\ParcelRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\WarehouseRepositoryInterface::class,
            \App\Repositories\WarehouseRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\CourierRepositoryInterface::class,
            \App\Repositories\CourierRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
