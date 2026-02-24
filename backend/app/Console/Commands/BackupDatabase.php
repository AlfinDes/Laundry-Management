<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup the PostgreSQL database to a sql.gz file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filename = "backup-" . now()->format('Y-m-d_H-i-s') . ".sql";
        $path = storage_path('app/backups');

        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }

        $fullPath = "{$path}/{$filename}";

        $this->info("Starting backup to {$filename}...");

        $command = sprintf(
            'PGPASSWORD="%s" pg_dump -h %s -p %s -U %s %s > %s',
            config('database.connections.pgsql.password'),
            config('database.connections.pgsql.host'),
            config('database.connections.pgsql.port'),
            config('database.connections.pgsql.username'),
            config('database.connections.pgsql.database'),
            $fullPath
        );

        $result = shell_exec($command);

        if (file_exists($fullPath) && filesize($fullPath) > 0) {
            $this->info("Compressing backup...");
            shell_exec("gzip {$fullPath}");
            $this->info("Backup completed successfully: {$filename}.gz");
        } else {
            $this->error("Backup failed! Check your database configuration.");
        }
    }
}
