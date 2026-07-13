<?php

namespace Database\Seeders;

use App\Models\GrantPlan;
use Illuminate\Database\Seeder;

class GrantPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            ['name' => 'Basic', 'application_fee' => 50, 'minimum_amount' => 500, 'maximum_amount' => 2000],
            ['name' => 'Silver', 'application_fee' => 100, 'minimum_amount' => 4000, 'maximum_amount' => 8000],
            ['name' => 'Gold', 'application_fee' => 150, 'minimum_amount' => 9000, 'maximum_amount' => 10000],
            ['name' => 'Platinum', 'application_fee' => 200, 'minimum_amount' => 9000, 'maximum_amount' => 12000],
        ];

        foreach ($plans as $plan) {
            GrantPlan::create($plan);
        }
    }
}