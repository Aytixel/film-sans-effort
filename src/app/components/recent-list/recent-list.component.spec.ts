import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentListComponent } from './recent-list.component';

describe('RecentListComponent', () => {
  let component: RecentListComponent;
  let fixture: ComponentFixture<RecentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
