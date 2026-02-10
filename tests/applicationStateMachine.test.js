import { isValidTransition, getValidNextStages } from '../src/utils/applicationStateMachine.js';

describe('Application State Machine', () => {
  describe('isValidTransition', () => {
    it('should allow Applied -> Screening transition', () => {
      expect(isValidTransition('Applied', 'Screening')).toBe(true);
    });

    it('should allow Screening -> Interview transition', () => {
      expect(isValidTransition('Screening', 'Interview')).toBe(true);
    });

    it('should allow Interview -> Offer transition', () => {
      expect(isValidTransition('Interview', 'Offer')).toBe(true);
    });

    it('should allow Offer -> Hired transition', () => {
      expect(isValidTransition('Offer', 'Hired')).toBe(true);
    });

    it('should allow transition to Rejected from any stage', () => {
      expect(isValidTransition('Applied', 'Rejected')).toBe(true);
      expect(isValidTransition('Screening', 'Rejected')).toBe(true);
      expect(isValidTransition('Interview', 'Rejected')).toBe(true);
      expect(isValidTransition('Offer', 'Rejected')).toBe(true);
    });

    it('should block invalid transition: Applied -> Offer (skipping steps)', () => {
      expect(isValidTransition('Applied', 'Offer')).toBe(false);
    });

    it('should block backward transition: Screening -> Applied', () => {
      expect(isValidTransition('Screening', 'Applied')).toBe(false);
    });

    it('should block invalid transition: Hired -> any other stage', () => {
      expect(isValidTransition('Hired', 'Applied')).toBe(false);
      expect(isValidTransition('Hired', 'Screening')).toBe(false);
      expect(isValidTransition('Hired', 'Rejected')).toBe(false);
    });

    it('should block transition to same stage', () => {
      expect(isValidTransition('Applied', 'Applied')).toBe(false);
      expect(isValidTransition('Screening', 'Screening')).toBe(false);
    });

    it('should handle case-insensitive transitions', () => {
      expect(isValidTransition('applied', 'screening')).toBe(true);
      expect(isValidTransition('SCREENING', 'INTERVIEW')).toBe(true);
    });
  });

  describe('getValidNextStages', () => {
    it('should return [Screening, Rejected] for Applied stage', () => {
      const validStages = getValidNextStages('Applied');
      expect(validStages).toContain('Screening');
      expect(validStages).toContain('Rejected');
    });

    it('should return [Interview, Rejected] for Screening stage', () => {
      const validStages = getValidNextStages('Screening');
      expect(validStages).toContain('Interview');
      expect(validStages).toContain('Rejected');
    });

    it('should return [Offer, Rejected] for Interview stage', () => {
      const validStages = getValidNextStages('Interview');
      expect(validStages).toContain('Offer');
      expect(validStages).toContain('Rejected');
    });

    it('should return [Hired, Rejected] for Offer stage', () => {
      const validStages = getValidNextStages('Offer');
      expect(validStages).toContain('Hired');
      expect(validStages).toContain('Rejected');
    });

    it('should return empty array for Hired stage (terminal state)', () => {
      const validStages = getValidNextStages('Hired');
      expect(validStages).toEqual([]);
    });

    it('should return empty array for Rejected stage (terminal state)', () => {
      const validStages = getValidNextStages('Rejected');
      expect(validStages).toEqual([]);
    });

    it('should handle invalid stage gracefully', () => {
      const validStages = getValidNextStages('InvalidStage');
      expect(Array.isArray(validStages)).toBe(true);
    });
  });
});
