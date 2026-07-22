<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GrantApplication;
use App\Models\Kyc;
use App\Models\Payment;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Withdrawal;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'verified_users' => Kyc::where('status', 'approved')->distinct('user_id')->count('user_id'),
                'pending_kyc' => Kyc::where('status', 'pending')->count(),
                'pending_payments' => Payment::where('status', 'pending')->count(),
                'pending_withdrawals' => Withdrawal::where('status', 'pending')->count(),
                'wallet_total' => Wallet::sum('balance'),
                'grant_applications' => GrantApplication::count(),
            ],
            'charts' => [
                'registrations' => $this->monthlySeries(User::class, $sixMonthsAgo),
                'funding' => $this->monthlySeries(Payment::class, $sixMonthsAgo, 'confirmed'),
                'withdrawals' => $this->monthlySeries(Withdrawal::class, $sixMonthsAgo, 'completed'),
            ],
        ]);
    }

    protected function monthlySeries(string $model, Carbon $since, ?string $statusFilter = null): array
    {
        $query = $model::where('created_at', '>=', $since);

        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        $rows = $query
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $key = Carbon::now()->subMonths($i)->format('Y-m');
            $months[] = [
                'month' => Carbon::now()->subMonths($i)->format('M'),
                'count' => $rows[$key] ?? 0,
            ];
        }

        return $months;
    }
}
