<?php

namespace Database\Seeders;


use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $admin = Role::create(['name' => 'admin']);
        $editor = Role::create(['name' => 'editor']);
        $viewer = Role::create(['name' => 'viewer']);
        $user = Role::create(['name' => 'user']);

        $createDocument = Permission::create(['name' => 'create-documents']);
        $editDocument = Permission::create(['name' => 'edit-documents']);
        $deleteDocument = Permission::create(['name' => 'delete-documents']);
        $viewDocument = Permission::create(['name' => 'view-documents']);
        $uploadDocument = Permission::create(['name' => 'upload-documents']);


        $admin->givePermissionTo(Permission::all());
        $editor->givePermissionTo([
            $createDocument,
            $editDocument,
            $viewDocument,
            $uploadDocument,
        ]);
        $viewer->givePermissionTo([
            $viewDocument,
        ]);

        $user->givePermissionTo([
            $uploadDocument,
            $viewDocument
        ]);

        $superAdmin = User::create([
            'name' => 'Mutsawashe Dupwa',
            'email' => 'h210154y@hit.ac.zw',
            'password' => Hash::make('Mutsawashe'),
        ]);

        $superAdmin->assignRole('admin');
    }
}
