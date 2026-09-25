<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Benefit;
use Illuminate\Http\Request;

class HomeController extends BasicController
{
    public $reactView = 'Admin/Home';
    public $reactRootView = 'admin';

    public function setReactViewProperties(Request $request)
    {
        $range = $request->input('range', 'mes_actual');
        $startDate = null;
        $endDate = \Carbon\Carbon::now();

        switch ($range) {
            case 'hoy':
                $startDate = \Carbon\Carbon::today();
                break;
            case 'ayer':
                $startDate = \Carbon\Carbon::yesterday();
                $endDate = \Carbon\Carbon::yesterday()->endOfDay();
                break;
            case '3_dias':
                $startDate = \Carbon\Carbon::now()->subDays(3);
                break;
            case 'semana_pasada':
                $startDate = \Carbon\Carbon::now()->subWeek();
                break;
            case '2_semanas':
                $startDate = \Carbon\Carbon::now()->subWeeks(2);
                break;
            case 'mes_actual':
                $startDate = \Carbon\Carbon::now()->startOfMonth();
                break;
            case 'personalizar':
                if ($request->filled('start_date') && $request->filled('end_date')) {
                    $startDate = \Carbon\Carbon::parse($request->input('start_date'))->startOfDay();
                    $endDate = \Carbon\Carbon::parse($request->input('end_date'))->endOfDay();
                } else {
                    $startDate = \Carbon\Carbon::now()->subDays(30);
                }
                break;
            default:
                $startDate = \Carbon\Carbon::now()->startOfMonth();
                break;
        }

        $today = \Carbon\Carbon::today();

        // Summary Stats (Filtered by range)
        $totalVisits = \App\Models\Visit::whereBetween('created_at', [$startDate, $endDate])->count();
        $todayVisits = \App\Models\Visit::whereDate('created_at', $today)->count();
        $totalLeads = \App\Models\Message::whereBetween('created_at', [$startDate, $endDate])->count();
        $todayLeads = \App\Models\Message::whereDate('created_at', $today)->count();

        // Conversion Rate
        $conversionRate = $totalVisits > 0 ? round(($totalLeads / $totalVisits) * 100, 2) : 0;

        // Chart Data (Filtered by range)
        $visitData = \App\Models\Visit::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        $leadData = \App\Models\Message::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        // UTM Sources (Filtered by range)
        $utmSources = \App\Models\Visit::whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('utm_source')
            ->selectRaw('utm_source as source, count(*) as count')
            ->groupBy('utm_source')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return [
            'metrics' => [
                'totalVisits' => $totalVisits,
                'todayVisits' => $todayVisits,
                'totalLeads' => $totalLeads,
                'todayLeads' => $todayLeads,
                'conversionRate' => $conversionRate,
                'charts' => [
                    'visits' => $visitData,
                    'leads' => $leadData,
                ],
                'utmSources' => $utmSources,
                'currentRange' => $range,
                'startDate' => $startDate->toDateString(),
                'endDate' => $endDate->toDateString(),
            ]
        ];
    }
}
