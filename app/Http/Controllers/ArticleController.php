<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Models\LandingHome;

class ArticleController extends BasicController
{
    public $reactView = 'BlogArticle';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        

        $currentArticle = Post::with(['category', 'tags'])->where('status', true)->where('slug', $request->slug)->first();
        $landing = LandingHome::where('correlative', '=', 'page_blog_footer')->first();
        $posts = Post::where('status', true)->orderBy('created_at', 'desc')->with('category')->limit(3)->get();

        return [
           
            'article' => $currentArticle,
            'posts' => $posts,
            'landing' => $landing,
       
        ];
    }
}
