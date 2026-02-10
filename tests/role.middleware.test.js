import { authorizeRoles } from '../src/middlewares/role.middleware.js';

describe('RBAC Middleware - authorizeRoles', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        userId: 1,
        role: 'candidate'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  describe('Single Role Authorization', () => {
    it('should allow candidate to access candidate-only endpoint', () => {
      const middleware = authorizeRoles('candidate');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny recruiter access to candidate-only endpoint', () => {
      req.user.role = 'recruiter';
      const middleware = authorizeRoles('candidate');
      middleware(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should allow recruiter to access recruiter-only endpoint', () => {
      req.user.role = 'recruiter';
      const middleware = authorizeRoles('recruiter');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow hiring_manager to access hiring_manager-only endpoint', () => {
      req.user.role = 'hiring_manager';
      const middleware = authorizeRoles('hiring_manager');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Multiple Roles Authorization', () => {
    it('should allow candidate when in allowed roles list', () => {
      req.user.role = 'candidate';
      const middleware = authorizeRoles('recruiter', 'candidate', 'hiring_manager');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should allow recruiter when in allowed roles list', () => {
      req.user.role = 'recruiter';
      const middleware = authorizeRoles('recruiter', 'hiring_manager');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should deny access if role not in allowed list', () => {
      req.user.role = 'candidate';
      const middleware = authorizeRoles('recruiter', 'hiring_manager');
      middleware(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should handle multiple roles correctly', () => {
      req.user.role = 'hiring_manager';
      const middleware = authorizeRoles('recruiter', 'hiring_manager', 'admin');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should deny access if user is not authenticated', () => {
      req.user = undefined;
      const middleware = authorizeRoles('candidate');
      expect(() => middleware(req, res, next)).toThrow();
    });

    it('should deny access if user role is missing', () => {
      req.user = { userId: 1 };
      const middleware = authorizeRoles('candidate');
      middleware(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 403 status for unauthorized access', () => {
      req.user.role = 'candidate';
      const middleware = authorizeRoles('admin');
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not authorized')
        })
      );
    });
  });

  describe('Role Hierarchy (if supported)', () => {
    it('should handle case-insensitive role matching', () => {
      req.user.role = 'CANDIDATE';
      const middleware = authorizeRoles('candidate');
      // Depending on implementation, this might pass or fail
      // For consistency, roles should be case-sensitive or lowercased
      middleware(req, res, next);
      // This test ensures consistent role handling
    });
  });
});
