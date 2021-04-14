import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'a',
        data: { pageTitle: 'myApp.a.home.title' },
        loadChildren: () => import('./a/a.module').then(m => m.AModule),
      },
      {
        path: 'b',
        data: { pageTitle: 'myApp.b.home.title' },
        loadChildren: () => import('./b/b.module').then(m => m.BModule),
      },
      {
        path: 'c',
        data: { pageTitle: 'myApp.c.home.title' },
        loadChildren: () => import('./c/c.module').then(m => m.CModule),
      },
      {
        path: 'd',
        data: { pageTitle: 'myApp.d.home.title' },
        loadChildren: () => import('./d/d.module').then(m => m.DModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
