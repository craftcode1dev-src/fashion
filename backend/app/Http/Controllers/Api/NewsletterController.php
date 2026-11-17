<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => strtolower(trim($validated['email']))],
            ['is_active' => true]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you for joining the Maison Valère circle. You will receive private salon invitations and early access.',
            'data' => $subscriber,
        ]);
    }
}
