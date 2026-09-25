<?php

namespace App\Providers;

use App\Models\Sale;
use App\Models\User;
use App\Observers\SaleCreationObserver;
use App\Observers\SaleStatusObserver;
use App\Observers\UserNameObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        Sale::observe([
            SaleCreationObserver::class,
            SaleStatusObserver::class,
        ]);
        User::observe(UserNameObserver::class);

        \Illuminate\Support\Facades\View::composer('public', function ($view) {
            try {
                $langId = app()->bound('current_lang_id') ? app('current_lang_id') : 1; 
                $generals = \App\Models\General::where('lang_id', $langId)->pluck('description', 'correlative');
                
                $view->with('seoTitle', !empty($generals['seo_title']) ? $generals['seo_title'] : env('APP_NAME'));
                $view->with('seoDescription', !empty($generals['seo_description']) ? $generals['seo_description'] : '');
                $view->with('seoKeywords', !empty($generals['seo_keywords']) ? $generals['seo_keywords'] : '');
                
                // Advanced SEO
                $view->with('companyName', !empty($generals['company_name']) ? $generals['company_name'] : env('APP_NAME'));
                $view->with('companyDescription', !empty($generals['company_description']) ? $generals['company_description'] : '');
                $view->with('companyLogo', !empty($generals['company_logo']) ? (str_starts_with($generals['company_logo'], 'http') ? $generals['company_logo'] : url($generals['company_logo'])) : asset('assets/img/logo.png'));
                $view->with('companyUrl', !empty($generals['company_url']) ? $generals['company_url'] : url('/'));
                $view->with('companyLocality', !empty($generals['company_locality']) ? $generals['company_locality'] : '');
                $view->with('companyRegion', !empty($generals['company_region']) ? $generals['company_region'] : '');
                $view->with('companyCountry', !empty($generals['company_country']) ? $generals['company_country'] : 'PE');
                $view->with('companyAddress', !empty($generals['company_address']) ? $generals['company_address'] : (!empty($generals['address']) ? $generals['address'] : ''));
                $view->with('companyPhone', !empty($generals['company_phone']) ? $generals['company_phone'] : (!empty($generals['support_phone']) ? $generals['support_phone'] : ''));
                $view->with('companyEmail', !empty($generals['company_email']) ? $generals['company_email'] : (!empty($generals['support_email']) ? $generals['support_email'] : ''));
                
                // Socials
                $view->with('twitterSite', !empty($generals['twitter_site']) ? $generals['twitter_site'] : '');
                $view->with('facebookPage', !empty($generals['facebook_page']) ? $generals['facebook_page'] : '');
                $view->with('instagramProfile', !empty($generals['instagram_profile']) ? $generals['instagram_profile'] : '');
                $view->with('linkedinProfile', !empty($generals['linkedin_profile']) ? $generals['linkedin_profile'] : '');
                
                // Verification
                $view->with('googleVerification', !empty($generals['google_site_verification']) ? $generals['google_site_verification'] : '');
                $view->with('bingVerification', !empty($generals['bing_site_verification']) ? $generals['bing_site_verification'] : '');
                
                $ogImageDefault = !empty($generals['og_image_default']) ? (str_starts_with($generals['og_image_default'], 'http') ? $generals['og_image_default'] : url($generals['og_image_default'])) : asset('assets/img/logo.png');
                $view->with('ogImageDefault', $ogImageDefault);

                // Pixels
                $view->with('facebookPixel', !empty($generals['facebook_pixel']) ? $generals['facebook_pixel'] : '');
                $view->with('gtmId', !empty($generals['google_tag_manager']) ? $generals['google_tag_manager'] : '');
                $view->with('gaId', !empty($generals['google_analytics']) ? $generals['google_analytics'] : '');
                $view->with('tiktokPixel', !empty($generals['tiktok_pixel']) ? $generals['tiktok_pixel'] : '');
                
                // Custom Scripts
                $view->with('headScripts', !empty($generals['head_scripts']) ? $generals['head_scripts'] : '');
                $view->with('bodyScripts', !empty($generals['body_scripts']) ? $generals['body_scripts'] : '');

            } catch (\Throwable $th) {
                $view->with('seoTitle', env('APP_NAME'));
                $view->with('seoDescription', '');
                $view->with('seoKeywords', '');
            }
        });
    }
}
