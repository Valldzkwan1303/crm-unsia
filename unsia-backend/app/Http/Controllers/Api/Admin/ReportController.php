<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller {
    public function downloadPDF() {
        $data = [
            'title' => 'LAPORAN KINERJA MARKETING UNSIA',
            'date' => date('d M Y'),
            'leads' => Lead::with('agent')->latest()->get(),
            'total' => Lead::count()
        ];
        
        $pdf = Pdf::loadView('reports.marketing', $data);
        return $pdf->download('Laporan-Marketing-UNSIA.pdf');
    }
}
