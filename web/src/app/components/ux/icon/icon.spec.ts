import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Icon } from './icon';

describe('Icon', () => {
  let component: Icon;
  let fixture: ComponentFixture<Icon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon],
    }).compileComponents();

    fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', undefined);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when rendered with an available icon', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('name', 'bus');
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should render the icon', () => {
      const icon = fixture.nativeElement.querySelector('[data-testid="bus-icon"]');

      expect(icon).not.toBeNull();
    });
  });

  describe('when rendered with an unavailable icon', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('name', 'no-name');
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should render the icon', () => {
      const icon = fixture.nativeElement.querySelector('svg');

      expect(icon).toBeNull();
    });
  });
});
