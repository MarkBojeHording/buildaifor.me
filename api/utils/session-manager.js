class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session && Date.now() - session.lastActivity > this.sessionTimeout) {
      this.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  updateSession(sessionId, data) {
    const session = this.getSession(sessionId) || {
      id: sessionId,
      createdAt: Date.now(),
      conversationStage: 'initial',
      caseDetails: {},
      userInfo: {},
      assessments: [],
      leadScore: null
    };
    Object.assign(session, data, {
      lastActivity: Date.now()
    });
    this.sessions.set(sessionId, session);
    return session;
  }
}

module.exports = { SessionManager };
