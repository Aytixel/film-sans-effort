import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationListComponent } from './recommendation-list.component';

describe('RecommendationListComponent', () => {
  let component: RecommendationListComponent;
  let fixture: ComponentFixture<RecommendationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
