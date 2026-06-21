# app.py - Updated with Google Gemini API

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any

# ============================================================================
# Google Gemini Setup
# ============================================================================

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    print("⚠️  google-generativeai not installed. Run: pip install google-generativeai")
    GEMINI_AVAILABLE = False

# Get API key from environment
gemini_api_key = os.environ.get("GEMINI_API_KEY")

# Configure Gemini
if GEMINI_AVAILABLE and gemini_api_key:
    try:
        genai.configure(api_key=gemini_api_key)
        gemini_model = genai.GenerativeModel('gemini-pro')
        print("✅ Google Gemini AI is ready!")
    except Exception as e:
        print(f"❌ Failed to configure Gemini: {e}")
        gemini_model = None
else:
    if not gemini_api_key:
        print("⚠️  GEMINI_API_KEY not set! Using mock responses.")
    gemini_model = None

# ============================================================================
# Models
# ============================================================================

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    reply: str
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    timestamp: str

class Message(BaseModel):
    role: str
    content: str

class HistoryResponse(BaseModel):
    session_id: str
    messages: List[Message]
    count: int

class Course(BaseModel):
    id: str
    title: str
    category: str
    level: str
    duration_hours: int
    price_usd: int
    rating: float
    description: str
    prerequisites: List[str]
    instructor: str

# ============================================================================
# App Setup
# ============================================================================

app = FastAPI(title="EduBot API", version="1.0.0")

# CORS - open for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with proper DB in production)
sessions: Dict[str, List[Dict[str, str]]] = {}

# Sample course data
COURSES = [
    {
        "id": "CS101",
        "title": "Python for Beginners",
        "category": "Programming",
        "level": "Beginner",
        "duration_hours": 12,
        "price_usd": 0,
        "rating": 4.8,
        "description": "Learn Python from scratch with hands-on projects.",
        "prerequisites": [],
        "instructor": "Dr. Sara Hassan"
    },
    {
        "id": "CS201",
        "title": "Web Development Bootcamp",
        "category": "Programming",
        "level": "Intermediate",
        "duration_hours": 40,
        "price_usd": 99,
        "rating": 4.9,
        "description": "Full-stack web development with React, Node.js, and MongoDB.",
        "prerequisites": ["Basic programming knowledge"],
        "instructor": "John Doe"
    },
    {
        "id": "DS101",
        "title": "Data Science Fundamentals",
        "category": "Data Science",
        "level": "Beginner",
        "duration_hours": 20,
        "price_usd": 49,
        "rating": 4.7,
        "description": "Introduction to data analysis, visualization, and machine learning.",
        "prerequisites": ["Basic Python"],
        "instructor": "Dr. Emily Chen"
    },
    {
        "id": "DS201",
        "title": "Machine Learning Mastery",
        "category": "Data Science",
        "level": "Advanced",
        "duration_hours": 35,
        "price_usd": 149,
        "rating": 4.9,
        "description": "Deep dive into ML algorithms, neural networks, and real-world applications.",
        "prerequisites": ["Python", "Statistics", "Data Science Fundamentals"],
        "instructor": "Dr. Michael Zhang"
    },
    {
        "id": "DES101",
        "title": "UI/UX Design Principles",
        "category": "Design",
        "level": "Beginner",
        "duration_hours": 15,
        "price_usd": 39,
        "rating": 4.6,
        "description": "Learn design thinking, user research, and creating beautiful interfaces.",
        "prerequisites": [],
        "instructor": "Sarah Johnson"
    }
]

# ============================================================================
# Helper Functions
# ============================================================================

def generate_session_id() -> str:
    """Generate a new session ID."""
    return str(uuid.uuid4())

def get_or_create_session(session_id: Optional[str]) -> str:
    """Get existing session or create new one."""
    if session_id and session_id in sessions:
        return session_id
    new_id = generate_session_id()
    sessions[new_id] = []
    return new_id

def get_mock_response(message: str) -> str:
    """Fallback mock responses when Gemini is not available."""
    text = message.lower()
    
    # Course recommendations
    if any(word in text for word in ["course", "learn", "study", "skill", "take"]):
        if "python" in text:
            return "CS101 - Python for Beginners is a great starting point! It's free and covers all fundamentals. Would you like to know more?"
        elif "web" in text or "react" in text or "full-stack" in text:
            return "CS201 - Web Development Bootcamp is perfect for you! It covers React, Node.js, and MongoDB. Want me to tell you more about the syllabus?"
        elif "data" in text or "science" in text or "ml" in text:
            return "We have DS101 - Data Science Fundamentals and DS201 - Machine Learning Mastery. Which level are you interested in?"
        elif "design" in text or "ui" in text or "ux" in text:
            return "DES101 - UI/UX Design Principles is a great choice! Learn design thinking and create beautiful interfaces."
        else:
            return "We have several great courses! 🎓\n\n• CS101: Python for Beginners (Free)\n• CS201: Web Development Bootcamp ($99)\n• DS101: Data Science Fundamentals ($49)\n• DS201: Machine Learning Mastery ($149)\n• DES101: UI/UX Design Principles ($39)\n\nWhich one interests you?"
    
    # Instructor questions
    if any(word in text for word in ["instructor", "teach", "who", "teacher"]):
        return "Our instructors are industry experts! 👨‍🏫\n\n• Dr. Sara Hassan - Python for Beginners\n• John Doe - Web Development Bootcamp\n• Dr. Emily Chen - Data Science Fundamentals\n• Dr. Michael Zhang - Machine Learning Mastery\n• Sarah Johnson - UI/UX Design Principles"
    
    # Pricing
    if any(word in text for word in ["price", "cost", "pricing", "expensive", "cheap", "affordable", "$"]):
        return "Our courses are very affordable! 💰\n\n• Python for Beginners: FREE\n• Web Development Bootcamp: $99\n• Data Science Fundamentals: $49\n• Machine Learning Mastery: $149\n• UI/UX Design Principles: $39\n\nWe also have discounts for multiple courses!"
    
    # Certificates
    if any(word in text for word in ["certificate", "cert", "credential", "degree"]):
        return "Yes! You earn a verifiable certificate of completion for every course! 🎓\n\n• Share on LinkedIn\n• Add to your resume\n• Digital and printable versions"
    
    # Help/Support
    if any(word in text for word in ["help", "support", "issue", "problem", "trouble"]):
        return "I'm here to help! 😊\n\nYou can ask me about:\n• Courses and recommendations\n• Instructor information\n• Pricing and certificates\n• Enrollment process\n• Refund policy\n\nWhat would you like to know?"
    
    # Default
    return "How can I help you today? 😊 You can ask me about courses, instructors, pricing, certificates, or anything else related to learning!"

def get_ai_response(message: str, history: List[Dict[str, str]]) -> str:
    """Get response from Gemini API or fallback to mock."""
    if not gemini_model:
        return get_mock_response(message)
    
    try:
        # Prepare conversation context
        context = ""
        if history:
            # Get last 5 messages for context
            recent_history = history[-5:]
            context = "Previous conversation:\n"
            for msg in recent_history:
                role = "Student" if msg["role"] == "user" else "Assistant"
                context += f"{role}: {msg['content']}\n"
        
        # Create the prompt
        prompt = f"""You are Loopy, a friendly AI assistant for an online learning platform called LoopLearn. 
You help students find courses, learn about instructors, understand pricing, and get enrolled.

{context}
Student: {message}
Assistant:"""
        
        # Get response from Gemini
        response = gemini_model.generate_content(prompt)
        reply = response.text.strip()
        
        # If Gemini returns empty, use mock
        if not reply:
            return get_mock_response(message)
        
        return reply
        
    except Exception as e:
        print(f"Gemini error: {e}")
        # If error, try mock response
        return get_mock_response(message)

# ============================================================================
# Endpoints
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "active_sessions": len(sessions),
        "ai_provider": "gemini" if gemini_model else "mock",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message and get a response."""
    if not request.message or len(request.message.strip()) < 1:
        raise HTTPException(status_code=422, detail="Message cannot be empty")
    if len(request.message) > 2000:
        raise HTTPException(status_code=422, detail="Message too long (max 2000 chars)")
    
    # Get or create session
    session_id = get_or_create_session(request.session_id)
    
    # Add user message to history
    sessions[session_id].append({
        "role": "user",
        "content": request.message
    })
    
    # Get response
    try:
        reply = get_ai_response(request.message, sessions[session_id])
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI API error: {str(e)}")
    
    # Add assistant response to history
    sessions[session_id].append({
        "role": "assistant",
        "content": reply
    })
    
    # Limit history to last 20 messages
    if len(sessions[session_id]) > 20:
        sessions[session_id] = sessions[session_id][-20:]
    
    return ChatResponse(
        session_id=session_id,
        reply=reply,
        input_tokens=len(request.message.split()),
        output_tokens=len(reply.split()),
        timestamp=datetime.now().isoformat()
    )

@app.get("/chat/{session_id}")
async def get_history(session_id: str):
    """Get conversation history for a session."""
    messages = sessions.get(session_id, [])
    return HistoryResponse(
        session_id=session_id,
        messages=[Message(**msg) for msg in messages],
        count=len(messages)
    )

@app.delete("/chat/{session_id}")
async def clear_session(session_id: str):
    """Clear a session."""
    if session_id in sessions:
        sessions[session_id] = []
    return {"status": "cleared", "session_id": session_id}

@app.get("/courses")
async def get_courses():
    """Get all courses."""
    return {"courses": COURSES, "total": len(COURSES)}

@app.get("/courses/search")
async def search_courses(q: str):
    """Search courses by keyword."""
    q_lower = q.lower()
    results = []
    for course in COURSES:
        if (q_lower in course["title"].lower() or
            q_lower in course["category"].lower() or
            q_lower in course["level"].lower() or
            q_lower in course["description"].lower() or
            any(q_lower in prereq.lower() for prereq in course["prerequisites"])):
            results.append(course)
    return {"query": q, "results": results, "total": len(results)}

@app.get("/courses/{course_id}")
async def get_course(course_id: str):
    """Get a single course by ID."""
    course_id = course_id.upper()
    for course in COURSES:
        if course["id"] == course_id:
            return course
    raise HTTPException(status_code=404, detail=f"Course '{course_id}' not found.")