<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\Faq::query();
        if ($request->has('category') && $request->category !== 'Semua') {
            $query->where('category', $request->category);
        }
        if ($request->has('search') && $request->search !== '') {
            $query->where('question', 'like', '%' . $request->search . '%')
                  ->orWhere('answer', 'like', '%' . $request->search . '%');
        }
        // Order popular first, then created_at
        $faqs = $query->orderBy('is_popular', 'desc')->orderBy('created_at', 'asc')->get();
        return response()->json($faqs);
    }

    public function feedback(Request $request, $id)
    {
        $faq = \App\Models\Faq::findOrFail($id);
        if ($request->is_helpful) {
            $faq->increment('helpful_count');
        } else {
            $faq->increment('not_helpful_count');
        }
        return response()->json(['message' => 'Feedback recorded', 'faq' => $faq]);
    }
}
