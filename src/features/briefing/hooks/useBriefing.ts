import { useState } from 'react';
import { aiService } from '@/lib/ai-service';
import { FileProcessingResult } from '@/types';
import { useGlobalModel } from '@/features/navigation/hooks';

export interface Briefing {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  contentCount: number;
}

export function useBriefing(processedContent: FileProcessingResult[]) {
  // Testing flag - set to true to enable mock briefings for testing
  const ENABLE_MOCK_BRIEFINGS = true;
  const { model } = useGlobalModel();

  const mockBriefings: Briefing[] = [
    {
      id: '1',
      title: 'Technical Architecture Analysis',
      content: `# Technical Architecture Analysis


## Executive Summary
This analysis examines the technical architecture of our AI Document Companion system, identifying key strengths and areas for improvement.

---

## Key Findings

### System Components
| Component | Status | Performance | Priority |
|-----------|--------|-------------|----------|
| Frontend (React/Next.js) | Stable | Excellent | High |
| AI Service Integration | Stable | Good | High |
| Document Processing | Needs Optimization | Moderate | Medium |
| Database Layer | Requires Migration | Poor | Critical |

### Performance Metrics
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Page Load Time | 2.3s | <1.5s | +53% |
| AI Response Time | 1.8s | <1.0s | +80% |
| Document Processing | 15s | <5s | +200% |
| Memory Usage | 45MB | <30MB | +50% |

---

## Risk Assessment

### High Priority Risks
1. **Database Performance**: Current implementation shows 300% slower query times
2. **Memory Leaks**: Document processing accumulates memory over time
3. **Scalability**: System cannot handle >100 concurrent users

### Medium Priority Risks
1. **Error Handling**: Inconsistent error recovery mechanisms
2. **Security**: Missing input validation in several endpoints
3. **Monitoring**: Limited observability into system health

---

## Recommendations

### Immediate Actions (Next 2 weeks)
- Implement database connection pooling
- Add memory usage monitoring
- Optimize document processing pipeline

### Short-term Improvements (1-2 months)
- Migrate to more efficient database schema
- Implement caching layer
- Add comprehensive error handling

### Long-term Strategy (3-6 months)
- Consider microservices architecture
- Implement auto-scaling capabilities
- Add advanced monitoring and alerting

---

## Conclusion
While the system demonstrates solid foundational architecture, immediate attention is required for database performance and memory management. The recommended improvements will significantly enhance system reliability and user experience.`,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      contentCount: 3,
    },
    {
      id: '2',
      title: 'User Experience Research Report',
      content: `# User Experience Research Report

---

## Executive Summary
Comprehensive analysis of user interactions and feedback reveals opportunities to significantly improve the user experience across all touchpoints.

---

## User Journey Analysis

### Onboarding Flow
| Step | Completion Rate | Pain Points | Priority |
|------|----------------|-------------|----------|
| Account Creation | 95% | None | Low |
| First Upload | 78% | File size limits unclear | Medium |
| First Chat | 82% | No guidance on questions | High |
| First Briefing | 45% | Process too complex | Critical |

### Feature Adoption
| Feature | Usage Rate | Satisfaction | Improvement Needed |
|---------|------------|--------------|-------------------|
| Document Upload | 89% | 4.2/5 | File type support |
| Chat Interface | 67% | 3.8/5 | Response speed |
| Briefing Generation | 34% | 3.1/5 | UI complexity |
| Export Options | 12% | 2.9/5 | Format variety |

---

## User Feedback Themes

### Positive Feedback
- **Intuitive Interface**: 87% of users find the UI easy to navigate
- **Fast Processing**: 76% satisfied with document processing speed
- **AI Quality**: 82% find AI responses helpful and accurate

### Areas for Improvement
- **Learning Curve**: 65% need help understanding advanced features
- **Mobile Experience**: 43% report issues on mobile devices
- **Export Options**: 78% want more export formats

---

## Recommendations

### High Impact, Low Effort
- Add tooltips and help text throughout the interface
- Implement progressive disclosure for advanced features
- Create quick-start guide for new users

### High Impact, Medium Effort
- Redesign briefing generation flow
- Improve mobile responsiveness
- Add export to PDF and Word formats

### Strategic Improvements
- Implement user onboarding wizard
- Add contextual help system
- Create user preference settings

---

## Success Metrics
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| User Retention (7-day) | 34% | 50% | 3 months |
| Feature Adoption | 45% | 65% | 6 months |
| User Satisfaction | 3.8/5 | 4.2/5 | 3 months |
| Support Tickets | 45/week | <20/week | 2 months |

---

## Conclusion
The user experience shows strong fundamentals but requires focused improvements in onboarding, mobile experience, and feature discoverability. Implementing the recommended changes will significantly improve user satisfaction and retention rates.`,
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      contentCount: 5,
    },
    {
      id: '3',
      title: 'Security Audit Findings',
      content: `# Security Audit Findings

---

## Executive Summary
Comprehensive security assessment reveals several critical vulnerabilities requiring immediate attention, alongside good practices in data handling and user privacy.

---

## Critical Vulnerabilities

### Authentication & Authorization
| Vulnerability | Severity | Impact | Mitigation |
|---------------|----------|--------|------------|
| Session Timeout | High | Account hijacking | Implement 15-min timeout |
| Password Policy | Medium | Weak passwords | Enforce complexity rules |
| API Rate Limiting | Critical | DoS attacks | Add rate limiting |
| Input Validation | High | Injection attacks | Sanitize all inputs |

### Data Protection
| Component | Encryption | Access Control | Compliance |
|-----------|------------|----------------|------------|
| User Data | AES-256 | Needs review | GDPR |
| Document Storage | At rest | Missing | Partial |
| API Communications | TLS 1.3 | JWT tokens | SOC 2 |
| Database | Column-level | Role-based | HIPAA |

---

## Risk Assessment Matrix

| Risk Level | Count | Examples |
|------------|-------|----------|
| Critical | 3 | API rate limiting, SQL injection, XSS |
| High | 7 | Session management, input validation |
| Medium | 12 | Password policies, logging |
| Low | 8 | UI improvements, documentation |

---

## Compliance Status

### GDPR Compliance
- Data minimization implemented
- User consent mechanisms
- Right to deletion
- Data portability (partial)
- Privacy impact assessment needed

### SOC 2 Type II
- Access controls
- Change management
- Incident response
- Monitoring and alerting
- Vendor management

---

## Immediate Actions Required

### Week 1 (Critical)
- Implement API rate limiting
- Fix SQL injection vulnerabilities
- Add input validation middleware

### Week 2-3 (High Priority)
- Review and update session management
- Implement comprehensive logging
- Update password policies

### Month 1 (Medium Priority)
- Complete privacy impact assessment
- Implement data portability features
- Enhance monitoring and alerting

---

## Long-term Security Strategy

### Infrastructure Security
- Implement zero-trust architecture
- Add intrusion detection systems
- Regular penetration testing

### Application Security
- Implement security headers
- Add content security policy
- Regular dependency updates

### Operational Security
- Security awareness training
- Incident response procedures
- Regular security audits

---

## Conclusion
While the system demonstrates good security practices in many areas, critical vulnerabilities require immediate attention. The recommended actions will significantly improve the overall security posture and ensure compliance with regulatory requirements.`,
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      contentCount: 4,
    },
  ];

  const [briefings, setBriefings] = useState<Briefing[]>(
    ENABLE_MOCK_BRIEFINGS ? mockBriefings : []
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBriefing = async () => {
    if (processedContent.length === 0) {
      return;
    }

    setIsGenerating(true);

    try {
      // Create a mock collection ID for this session
      const collectionId = 'temp-collection-' + Date.now();
      
      // Prepare context from content
      const context = processedContent.map((item, index) => ({
        id: `content-${index}`,
        text: item.text,
        source: {
          documentId: `doc-${index}`,
          documentTitle: item.metadata.customName || item.metadata.filename || item.metadata.summary || `Content ${index + 1}`,
          chunkId: `chunk-${index}`,
        },
        score: 1.0,
      }));

      // Generate briefing using AI service
      const response = await aiService.generateBriefing(
        collectionId,
        [], // No previous exchanges for now
        context,
        model
      );

      const newBriefing: Briefing = {
        id: Date.now().toString(),
        title: model === 'mock-api' ? 'Mock Summary' : 'Summary',
        content: response.answer,
        timestamp: new Date(),
        contentCount: processedContent.length,
      };

      setBriefings(prev => [newBriefing, ...prev]);
      
      // The skeleton will be hidden by useEffect in the component
      


      return newBriefing;
    } catch (error) {
      console.error('Error generating briefing:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteBriefing = (id: string) => {
    setBriefings(prev => prev.filter(briefing => briefing.id !== id));
  };

  return {
    briefings,
    isGenerating,
    generateBriefing,
    deleteBriefing,
  };
}
