<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;

class CleanUnusedImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:compress {--quality=70 : Quality of the images (0-100)} {--max-width=1200 : Maximum width of images}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compress all images in storage/app/images recursively to reduce file size';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $quality = (int) $this->option('quality');
        $maxWidth = (int) $this->option('max-width');

        $this->info("Starting image compression in storage/app/images...");
        $this->info("Target quality: {$quality}%");

        $disk = Storage::disk('local');
        $directory = 'images';

        if (!$disk->exists($directory)) {
            $this->error("Directory storage/app/{$directory} does not exist.");
            return;
        }

        // Get all files recursively
        $allFiles = $disk->allFiles($directory);
        
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $filesToProcess = array_filter($allFiles, function ($file) use ($imageExtensions) {
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            return in_array($extension, $imageExtensions);
        });

        $total = count($filesToProcess);
        if ($total === 0) {
            $this->info("No images found to compress.");
            return;
        }

        $this->info("Found {$total} images. Starting compression...");
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $savedBytes = 0;

        foreach ($filesToProcess as $relativePath) {
            $fullPath = storage_path("app/{$relativePath}");
            
            try {
                $originalSize = filesize($fullPath);
                
                // Load image
                $img = Image::make($fullPath);

                // Optional: Resize if it's too large
                if ($img->width() > $maxWidth) {
                    $img->resize($maxWidth, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                }

                // Save back with quality compression
                // Note: Extension is maintained by saving to the same path
                $img->save($fullPath, $quality);

                $newSize = filesize($fullPath);
                $savedBytes += ($originalSize - $newSize);

            } catch (\Exception $e) {
                $this->error("\nError processing {$relativePath}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        $savedMb = round($savedBytes / 1024 / 1024, 2);
        $this->info("Compression complete!");
        $this->info("Total space saved: {$savedMb} MB");
    }
}
