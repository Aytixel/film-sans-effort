import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AfficheComponent } from './app/components/affiche/affiche.component';

bootstrapApplication(AfficheComponent, appConfig)
  .catch((err) => console.error(err));
