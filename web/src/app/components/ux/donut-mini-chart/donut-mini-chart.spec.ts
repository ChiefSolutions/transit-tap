import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DonutMiniChart } from './donut-mini-chart';

describe('DonutMiniChart (DOM Tests)', () => {
  let fixture: ComponentFixture<DonutMiniChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutMiniChart],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutMiniChart);
    fixture.detectChanges();
  });

  describe('when rendered with set inputs', () => {
    it('should apply the correct dimensions and aria-label to the root svg', () => {
      fixture.componentRef.setInput('size', 120);
      fixture.componentRef.setInput('initial', 50);
      fixture.componentRef.setInput('total', 100);
      fixture.detectChanges();

      const svgEl = fixture.debugElement.query(By.css('svg')).nativeElement;

      expect(svgEl.getAttribute('width')).toBe('120');
      expect(svgEl.getAttribute('height')).toBe('120');
      expect(svgEl.getAttribute('aria-label')).toContain('50% tap-in');
    });
  });

  describe('when displaying percentage text', () => {
    it('should render the correct percentage text in the center', () => {
      fixture.componentRef.setInput('initial', 30);
      fixture.componentRef.setInput('total', 100);
      fixture.detectChanges();

      const textEl = fixture.debugElement.query(By.css('text')).nativeElement;
      expect(textEl.textContent.trim()).toBe('30%');
    });
  });

  describe('when initial is zero', () => {
    it('should not show the progress circle', () => {
      fixture.componentRef.setInput('initial', 0);
      fixture.componentRef.setInput('total', 100);
      fixture.detectChanges();

      const circles = fixture.debugElement.queryAll(By.css('circle'));
      expect(circles.length).toBe(2);
    });
  });

  describe('when initial is greater than zero', () => {
    it('should render the progress circle and apply custom CSS classes', () => {
      fixture.componentRef.setInput('initial', 10);
      fixture.componentRef.setInput('total', 100);
      fixture.componentRef.setInput('progressCssClass', 'custom-green-glow');
      fixture.detectChanges();

      const circles = fixture.debugElement.queryAll(By.css('circle'));
      expect(circles.length).toBe(3);

      const progressCircle = circles[2].nativeElement;
      expect(progressCircle.classList.contains('custom-green-glow')).toBe(true);
      expect(progressCircle.getAttribute('transform')).toBe('rotate(-90 100 100)');
    });
  });

  describe('when the outer circle is rendered', () => {
    it('should update the out-circle transform calculation based on the slice orientation', () => {
      fixture.componentRef.setInput('initial', 25);
      fixture.componentRef.setInput('total', 100);
      fixture.detectChanges();

      const outCircle = fixture.debugElement.queryAll(By.css('circle'))[1].nativeElement;
      expect(outCircle.getAttribute('transform')).toBe('rotate(0 100 100)');
    });
  });
});
