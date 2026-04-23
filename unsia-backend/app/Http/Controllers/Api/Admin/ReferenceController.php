<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudyProgram;
use App\Models\Region;
use App\Models\EducationLevel;
use App\Models\Institution;

class ReferenceController extends Controller
{

    private function getModel($type)
    {
        return match ($type) {
            'prodi' => StudyProgram::class,
            'wilayah' => Region::class,
            'jenjang' => EducationLevel::class,
            'institusi' => Institution::class,
            default => null,
        };
    }

    public function index(Request $request)
    {
        $model = $this->getModel($request->query('type'));
        if (!$model) return response()->json(['message' => 'Invalid type'], 400);

        return response()->json($model::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $model = $this->getModel($request->query('type'));
        if (!$model) return response()->json(['message' => 'Invalid type'], 400);

        $data = $request->validate([
            'code' => 'required',
            'name' => 'required',
            'status' => 'required',
            'description' => 'nullable', 
            'degree' => 'nullable',     
            'category' => 'nullable'  
        ]);

        $model::create($data);
        return response()->json(['message' => 'Data berhasil disimpan']);
    }

    public function update(Request $request, $id)
    {
        $model = $this->getModel($request->query('type'));
        if (!$model) return response()->json(['message' => 'Invalid type'], 400);

        $item = $model::findOrFail($id);
        $item->update($request->all());

        return response()->json(['message' => 'Data berhasil diperbarui']);
    }

    public function destroy(Request $request, $id)
    {
        $model = $this->getModel($request->query('type'));
        if (!$model) return response()->json(['message' => 'Invalid type'], 400);

        $model::findOrFail($id)->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}