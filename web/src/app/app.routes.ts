import { Routes } from '@angular/router';
import { tapFeature, TapEffects } from './taps';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./taps').then((m) => m.TapsList),
    providers: [provideState(tapFeature), provideEffects(TapEffects)],
  },
];
