// src/features/instructor/utils/courseHelper.js
// Helper for editable lists (stable keys)
export const toEditableList = (arr) => (arr || []).map((text, idx) => ({ id: idx + 1, text }));
export const fromEditableList = (arr) => arr?.map(i => i.text).filter(t => t?.trim()) || null;

// TimeSpan "HH:MM:SS" → minutes
export const timeSpanToMinutes = (timeSpan) => {
  if (!timeSpan || typeof timeSpan !== 'string') return 0;
  const parts = timeSpan.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
  }
  return parseInt(timeSpan, 10) || 0;
};

// Minutes → "HH:MM:SS"
export const minutesToTimeSpan = (minutes) => {
  const mins = Math.max(0, parseInt(minutes, 10) || 0);
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hrs.toString().padStart(2, '0')}:${remainingMins.toString().padStart(2, '0')}:00`;
};

// Detect fake frontend IDs (Date.now() or large numbers)
const isFakeId = (id) => {
  return id && typeof id === 'number' && id > 1_000_000;
};

// Transform backend sections to frontend sections
export const transformBackendSections = (sections) => {
  if (!sections) return [];
  return sections.map((sec, idx) => ({
    id: sec.id,
    title: sec.title,
    order: sec.order ?? idx,
    items: sec.items.map(item => {
      if (item.type === 'Lesson') {
        return {
          type: 'Lesson',
          lesson: {
            id: item.lesson.id,
            title: item.lesson.title,
            description: item.lesson.description || '',
            videoUrl: item.lesson.videoUrl || '',
            order: item.lesson.order,
            isPreview: item.lesson.isPreview || false,
            duration: timeSpanToMinutes(item.lesson.duration)
          }
        };
      } else if (item.type === 'Quiz') {
        return {
          type: 'Quiz',
          quiz: {
            id: item.quiz.id,
            title: item.quiz.title,
            description: item.quiz.description || '',
            passingScore: item.quiz.passingScore,
            isRequired: item.quiz.isRequired,
            questions: (item.quiz.questions || []).map(q => ({
              id: q.id,
              body: q.body,
              points: q.points,
              options: (q.options || []).map(opt => ({
                id: opt.id,
                body: opt.body,
                isCorrect: opt.isCorrect
              }))
            }))
          }
        };
      }
      return item;
    })
  }));
};

// Transform frontend sections to backend format
export const transformFrontendSections = (sections) => {
  if (!sections) return null;
  return sections.map(sec => ({
    id: (!isFakeId(sec.id)) ? sec.id : null,
    title: sec.title,
    order: sec.order ?? 0,
    items: (sec.items || []).map(item => {
      if (item.type === 'Lesson') {
        const lesson = item.lesson;
        return {
          type: 'Lesson',
          lesson: {
            id: (!isFakeId(lesson.id)) ? lesson.id : null,
            title: lesson.title,
            description: lesson.description || '',
            videoUrl: lesson.videoUrl || '',
            order: lesson.order ?? 0,
            isPreview: lesson.isPreview || false,
            duration: minutesToTimeSpan(lesson.duration || 0)
          }
        };
      } else if (item.type === 'Quiz') {
        const quiz = item.quiz;
        return {
          type: 'Quiz',
          quiz: {
            id: (!isFakeId(quiz.id)) ? quiz.id : null,
            title: quiz.title,
            description: quiz.description || '',
            passingScore: quiz.passingScore || 0,
            isRequired: quiz.isRequired || false,
            questions: (quiz.questions || []).map(q => ({
              id: (!isFakeId(q.id)) ? q.id : null,
              body: q.body,
              points: q.points || 0,
              options: (q.options || []).map(opt => ({
                id: (!isFakeId(opt.id)) ? opt.id : null,
                body: opt.body,
                isCorrect: opt.isCorrect || false
              }))
            }))
          }
        };
      }
      return item;
    })
  }));
};

// Transform backend tags to frontend format (ensure consistent structure)
export const transformBackendTags = (tags, tagIds) => {
  if (!tags && !tagIds) return [];

  // If we have both tags and tagIds, merge them properly
  if (tags && tagIds && Array.isArray(tags) && Array.isArray(tagIds)) {
    return tags.map((tag, idx) => ({
      id: tag.id || tagIds[idx],
      name: tag.name || 'Unknown'
    })).filter(t => t.id);
  }

  // If only tags array with objects
  if (tags && Array.isArray(tags)) {
    return tags.map(tag => ({
      id: tag.id,
      name: tag.name || tag.tagName || 'Unknown'
    })).filter(t => t.id);
  }

  // If only tagIds array
  if (tagIds && Array.isArray(tagIds)) {
    return tagIds.map(id => ({ id, name: 'Loading...' }));
  }

  return [];
};

// Prepare course data for save (flatten all sections into payload)
export const prepareCourseSavePayload = (course) => {
  const tagIds = Array.isArray(course.tagIds) 
    ? course.tagIds 
    : (course.tags || []).map(t => t.id).filter(Boolean);

  return {
    description: course.description || '',
    thumbnailUrl: course.thumbnailUrl || '',
    subtitle: course.subtitle || '',
    language: course.language || 'en',
    level: course.level || 'Beginner',
    isFree: course.isFree ?? false,
    price: course.isFree ? 0 : (course.price ?? 0),
    requirements: fromEditableList(course.requirements),
    learningOutcomes: fromEditableList(course.learningObjectives),
    targetAudiences: fromEditableList(course.targetAudience),
    tagIds: tagIds,
    sections: transformFrontendSections(course.sections)
  };
};

// Calculate course completion percentage for progress bar
export const calculateCompletion = (course) => {
  if (!course) return 0;
  let completed = 0;
  let total = 6; // Total sections to complete

  if (course.title?.trim()) completed++;
  if (course.category) completed++;
  if (course.description?.trim()?.length > 50) completed++;
  if (course.thumbnailUrl) completed++;
  if ((course.learningObjectives || []).length >= 3) completed++;
  if ((course.sections || []).length > 0 && 
      course.sections.some(s => s.items?.some(i => i.type === 'Lesson'))) completed++;

  return Math.round((completed / total) * 100);
};