import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheComponent } from './affiche.component';

describe('AfficheComponent', () => {
  let component: AfficheComponent;
  let fixture: ComponentFixture<AfficheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AfficheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
