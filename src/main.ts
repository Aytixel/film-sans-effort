import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { TestapiComponent } from './app/components/testapi/testapi.component';

bootstrapApplication(TestapiComponent, appConfig)
  .catch((err) => console.error(err));
