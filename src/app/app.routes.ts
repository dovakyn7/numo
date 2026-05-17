import { Routes } from '@angular/router';
import { Mobile } from './views/mobile/mobile';
import { Dashboard } from './views/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: Mobile },
    { path: 'dashboard', component: Dashboard },
    { path: '**', redirectTo: '' }
];
