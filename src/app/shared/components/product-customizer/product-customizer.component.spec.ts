import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';

import { ProductCustomizerComponent } from './product-customizer.component';

describe('ProductCustomizerComponent', () => {
  let component: ProductCustomizerComponent;
  let fixture: ComponentFixture<ProductCustomizerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCustomizerComponent],
      imports: [IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(ProductCustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
