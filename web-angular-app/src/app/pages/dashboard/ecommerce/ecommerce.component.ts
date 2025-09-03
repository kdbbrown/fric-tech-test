import { Component } from '@angular/core';
import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';


@Component({
  selector: 'app-ecommerce',
  imports: [
    EcommerceMetricsComponent,
  ],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent {}
