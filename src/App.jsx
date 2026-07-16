import { useEffect, useMemo, useState } from "react";
import {
  FaBars,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaGraduationCap,
  FaLayerGroup,
  FaMoon,
  FaPlay,
  FaSearch,
  FaSun,
  FaTasks,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import "./App.css";

const defaultCourses = [
  {
    id: 1,
    title: "React Development",
    category: "Frontend",
    level: "Intermediate",
    lessons: 10,
    completedLessons: 7,
    duration: "18 Hours",
    icon: "react",
    description:
      "Build modern user interfaces using components, hooks and practical React projects.",
  },
  {
    id: 2,
    title: "JavaScript Mastery",
    category: "Programming",
    level: "Beginner",
    lessons: 10,
    completedLessons: 5,
    duration: "22 Hours",
    icon: "javascript",
    description:
      "Master JavaScript fundamentals, ES6, DOM and asynchronous programming.",
  },
  {
    id: 3,
    title: "Node.js and Express",
    category: "Backend",
    level: "Intermediate",
    lessons: 10,
    completedLessons: 3,
    duration: "16 Hours",
    icon: "backend",
    description:
      "Build secure REST APIs and scalable backend applications using Node.js.",
  },
  {
    id: 4,
    title: "MongoDB Database",
    category: "Database",
    level: "Beginner",
    lessons: 10,
    completedLessons: 6,
    duration: "12 Hours",
    icon: "database",
    description:
      "Learn database design, CRUD operations and MongoDB integration.",
  },
  {
    id: 5,
    title: "UI/UX Fundamentals",
    category: "Design",
    level: "Beginner",
    lessons: 10,
    completedLessons: 2,
    duration: "10 Hours",
    icon: "design",
    description:
      "Create clean, accessible and user-friendly digital experiences.",
  },
  {
    id: 6,
    title: "Git and GitHub",
    category: "Tools",
    level: "Beginner",
    lessons: 10,
    completedLessons: 8,
    duration: "8 Hours",
    icon: "tools",
    description:
      "Track changes, manage repositories and collaborate with development teams.",
  },
];

const videoData = [
  {
    id: 1,
    title: "React Components Explained",
    courseId: 1,
    course: "React Development",
    duration: "18:24",
    description: "Understand reusable components, props and component structure.",
  },
  {
    id: 2,
    title: "JavaScript Arrays and Methods",
    courseId: 2,
    course: "JavaScript Mastery",
    duration: "22:10",
    description: "Practice map, filter, reduce and modern array methods.",
  },
  {
    id: 3,
    title: "Building Your First REST API",
    courseId: 3,
    course: "Node.js and Express",
    duration: "26:42",
    description: "Create routes, controllers and API responses with Express.",
  },
  {
    id: 4,
    title: "MongoDB CRUD Operations",
    courseId: 4,
    course: "MongoDB Database",
    duration: "19:35",
    description: "Insert, read, update and delete MongoDB documents.",
  },
];

const defaultAssignments = [
  {
    id: 1,
    title: "Build a Responsive Portfolio",
    course: "React Development",
    dueDate: "22 July 2026",
    points: 100,
    status: "Pending",
  },
  {
    id: 2,
    title: "JavaScript Quiz Application",
    course: "JavaScript Mastery",
    dueDate: "25 July 2026",
    points: 80,
    status: "Submitted",
  },
  {
    id: 3,
    title: "Create REST API Endpoints",
    course: "Node.js and Express",
    dueDate: "28 July 2026",
    points: 120,
    status: "Pending",
  },
];

function courseProgress(course) {
  return Math.round((course.completedLessons / course.lessons) * 100);
}

function getCourseIcon(name) {
  if (name === "react") return <FaBookOpen />;
  if (name === "javascript") return <FaLayerGroup />;
  if (name === "backend") return <FaGraduationCap />;
  if (name === "database") return <FaBookOpen />;
  if (name === "design") return <FaLayerGroup />;
  return <FaTasks />;
}

function App() {
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("lms-dark-mode") === "true"
  );
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("lms-courses");
    return saved ? JSON.parse(saved) : defaultCourses;
  });
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("lms-assignments");
    return saved ? JSON.parse(saved) : defaultAssignments;
  });
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = localStorage.getItem("lms-enrolled");
    return saved ? JSON.parse(saved) : [1, 2, 6];
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [learningCourseId, setLearningCourseId] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("lms-logged-in") === "true"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("lms-courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("lms-assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("lms-enrolled", JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    localStorage.setItem("lms-dark-mode", darkMode);
  }, [darkMode]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const value = search.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(value) ||
        course.description.toLowerCase().includes(value);
      const matchesCategory =
        category === "All" || course.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [courses, search, category]);

  const averageProgress = Math.round(
    courses.reduce((sum, course) => sum + courseProgress(course), 0) /
      courses.length
  );

  const submittedCount = assignments.filter(
    (assignment) => assignment.status === "Submitted"
  ).length;

  const completedCourses = courses.filter(
    (course) => courseProgress(course) === 100
  ).length;

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2300);
  }

  function changePage(page) {
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function enrollCourse(courseId) {
    if (enrolledCourses.includes(courseId)) {
      setSelectedCourse(courses.find((course) => course.id === courseId));
      return;
    }

    setEnrolledCourses((current) => [...current, courseId]);
    notify("Course enrolled successfully!");
  }

  function completeVideo(video) {
    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === video.courseId
          ? {
              ...course,
              completedLessons: Math.min(
                course.completedLessons + 1,
                course.lessons
              ),
            }
          : course
      )
    );
    setSelectedVideo(null);
    notify("Lesson completed. Progress updated!");
  }

  function submitAssignment(id) {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === id
          ? { ...assignment, status: "Submitted" }
          : assignment
      )
    );
    notify("Assignment submitted successfully!");
  }

  function handleLogin(event) {
    event.preventDefault();
  
    const validEmail = "student@lms.com";
    const validPassword = "123456";
  
    if (email === validEmail && password === validPassword) {
      setLoggedIn(true);
      localStorage.setItem("lms-logged-in", "true");
      setShowLogin(false);
      notify("Login successful. Welcome, Satnam!");
    } else {
      notify("Invalid Email or Password");
    }
  }
  function resetDemo() {
    setCourses(defaultCourses);
    setAssignments(defaultAssignments);
    setEnrolledCourses([1, 2, 6]);
    setLearningCourseId(null);
    setActiveLessonIndex(0);
    notify("Demo data reset successfully.");
  }

  function openLearning(courseId) {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses((current) => [...current, courseId]);
      notify("Course enrolled successfully!");
    }

    const course = courses.find((item) => item.id === courseId);
    setLearningCourseId(courseId);
    setActiveLessonIndex(
      Math.min(course?.completedLessons || 0, (course?.lessons || 1) - 1)
    );
    changePage("learn");
  }

  function completeCurrentLesson() {
    const course = courses.find((item) => item.id === learningCourseId);
    if (!course) return;

    const lessonNumber = activeLessonIndex + 1;

    if (lessonNumber > course.completedLessons) {
      setCourses((current) =>
        current.map((item) =>
          item.id === learningCourseId
            ? {
                ...item,
                completedLessons: Math.min(
                  item.completedLessons + 1,
                  item.lessons
                ),
              }
            : item
        )
      );
      notify("Lesson completed. Course progress increased!");
    } else {
      notify("This lesson is already completed.");
    }

    if (activeLessonIndex < course.lessons - 1) {
      setActiveLessonIndex((index) => index + 1);
    }
  }

  function lessonTitle(course, index) {
    const common = [
      "Course Introduction",
      "Core Concepts",
      "Environment Setup",
      "Fundamentals in Practice",
      "Working with Components",
      "Data and State Management",
      "Handling User Interaction",
      "Building a Practical Feature",
      "Testing and Improvement",
      "Final Project and Review",
    ];

    return `${index + 1}. ${common[index]} — ${course.title}`;
  }

  function lessonContent(course, index) {
    const content = [
      `This lesson introduces ${course.title}, its purpose, learning outcomes and the tools used throughout the course.`,
      `Learn the most important concepts of ${course.title} with simple definitions and practical examples.`,
      `Set up the required development environment and understand the recommended project structure.`,
      `Apply the fundamentals through small examples before moving to larger application features.`,
      `Understand reusable building blocks and how they improve maintainability and development speed.`,
      `Learn how information is stored, updated and displayed while an application is running.`,
      `Handle buttons, forms and other user actions to create an interactive learning experience.`,
      `Build a practical feature using the concepts completed in the previous lessons.`,
      `Review the feature, test expected behavior and improve usability and code quality.`,
      `Complete the final activity, review the full course and prepare to explain the project in a viva.`,
    ];

    return content[index];
  }

  const learningCourse = courses.find(
    (course) => course.id === learningCourseId
  );

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="navbar">
        <button className="brand" onClick={() => changePage("home")}>
          <span className="brand-icon">
            <FaGraduationCap />
          </span>
          <span>LearnSphere</span>
        </button>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open navigation menu"
        >
          <FaBars />
        </button>

        <nav className={`nav-links ${menuOpen ? "show-menu" : ""}`}>
          {["home", "courses", "videos", "assignments", "progress"].map(
            (page) => (
              <button
                key={page}
                className={activePage === page ? "active" : ""}
                onClick={() => changePage(page)}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            )
          )}
        </nav>

        <div className="nav-actions">
          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button className="login-button" onClick={() => setShowLogin(true)}>
            <FaUser />
            {loggedIn ? "Satnam" : "Login"}
          </button>
        </div>
      </header>

      {toast && <div className="toast">{toast}</div>}

      {activePage === "home" && (
        <main>
          <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">SMART LEARNING PLATFORM</span>
              <h1>
                Learn new skills and
                <span> build your future.</span>
              </h1>
              <p>
                Access professional courses, practical video lessons,
                assignments and real progress tracking from one modern
                learning platform.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-button"
                  onClick={() => changePage("courses")}
                >
                  Explore Courses
                </button>
                <button
                  className="secondary-button"
                  onClick={() => changePage("progress")}
                >
                  View Progress
                </button>
              </div>

              <div className="hero-benefits">
                <span>
                  <FaCheckCircle /> Structured learning
                </span>
                <span>
                  <FaCheckCircle /> Working assignments
                </span>
                <span>
                  <FaCheckCircle /> Dynamic progress
                </span>
              </div>
            </div>

            <div className="dashboard-preview">
              <div className="preview-heading">
                <div>
                  <span>Overall progress</span>
                  <h3>Keep learning!</h3>
                </div>
                <div className="progress-circle">{averageProgress}%</div>
              </div>

              <div className="preview-progress">
                {courses.slice(0, 3).map((course) => (
                  <PreviewProgress key={course.id} course={course} />
                ))}
              </div>

              <div className="next-lesson">
                <span>Next lesson</span>
                <strong>React Hooks in Practice</strong>
                <small>Today · 4:00 PM</small>
              </div>
            </div>
          </section>

          <section className="stats">
            <StatItem value={courses.length} label="Professional Courses" />
            <StatItem value={videoData.length} label="Video Lessons" />
            <StatItem value={assignments.length} label="Assignments" />
            <StatItem value={`${averageProgress}%`} label="Average Progress" />
          </section>

          <section className="content-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow dark-text">POPULAR COURSES</span>
                <h2>Continue your learning journey</h2>
              </div>
              <button
                className="view-all-button"
                onClick={() => changePage("courses")}
              >
                View all courses →
              </button>
            </div>

            <div className="course-grid">
              {courses.slice(0, 3).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrolled={enrolledCourses.includes(course.id)}
                  onEnroll={() => enrollCourse(course.id)}
                  onLearn={() => openLearning(course.id)}
                  onDetails={() => setSelectedCourse(course)}
                />
              ))}
            </div>
          </section>
        </main>
      )}

      {activePage === "courses" && (
        <Page
          eyebrow="COURSE LIBRARY"
          title="Explore all courses"
          description="Search and filter courses according to your learning goals."
        >
          <div className="course-toolbar">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {[
                "All",
                "Frontend",
                "Programming",
                "Backend",
                "Database",
                "Design",
                "Tools",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="course-grid">
            {filteredCourses.map((course) => (
              <CourseCard
              key={course.id}
              course={course}
              enrolled={enrolledCourses.includes(course.id)}
              onEnroll={() => enrollCourse(course.id)}
              onLearn={() => openLearning(course.id)}
              onDetails={() => setSelectedCourse(course)}
            />
            ))}
          </div>
        </Page>
      )}

      {activePage === "videos" && (
        <Page
          eyebrow="VIDEO LEARNING"
          title="Video lessons"
          description="Open a lesson and mark it as completed to update course progress."
        >
          <div className="video-grid">
            {videoData.map((video, index) => (
              <article className="video-card" key={video.id}>
                <button
                  className="video-thumbnail"
                  onClick={() => setSelectedVideo(video)}
                >
                  <span className="play-button">
                    <FaPlay />
                  </span>
                  <small>{video.duration}</small>
                </button>

                <div className="video-details">
                  <span>Lesson {index + 1}</span>
                  <h3>{video.title}</h3>
                  <p>{video.course}</p>
                  <button onClick={() => setSelectedVideo(video)}>
                    Watch Lesson
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Page>
      )}

      {activePage === "assignments" && (
        <Page
          eyebrow="PRACTICAL LEARNING"
          title="Assignments"
          description="Complete practical tasks and apply what you have learned."
        >
          <div className="assignment-list">
            {assignments.map((assignment) => (
              <article className="assignment-card" key={assignment.id}>
                <div className="assignment-information">
                  <span
                    className={`assignment-status ${assignment.status.toLowerCase()}`}
                  >
                    {assignment.status}
                  </span>
                  <h3>{assignment.title}</h3>
                  <p>{assignment.course}</p>
                </div>

                <div className="assignment-meta">
                  <div>
                    <span>Due date</span>
                    <strong>{assignment.dueDate}</strong>
                  </div>
                  <div>
                    <span>Points</span>
                    <strong>{assignment.points}</strong>
                  </div>
                </div>

                <button
                  disabled={assignment.status === "Submitted"}
                  onClick={() => submitAssignment(assignment.id)}
                >
                  {assignment.status === "Submitted"
                    ? "Submitted ✓"
                    : "Submit Assignment"}
                </button>
              </article>
            ))}
          </div>
        </Page>
      )}

      {activePage === "progress" && (
        <Page
          eyebrow="STUDENT DASHBOARD"
          title="Your learning progress"
          description="Progress is saved in the browser and updates whenever a lesson is completed."
        >
          <div className="summary-grid">
            <SummaryCard label="Enrolled courses" value={enrolledCourses.length} />
            <SummaryCard label="Submitted assignments" value={submittedCount} />
            <SummaryCard label="Average progress" value={`${averageProgress}%`} />
            <SummaryCard label="Completed courses" value={completedCourses} />
          </div>

          <div className="progress-list">
            {courses.map((course) => (
              <article className="progress-card" key={course.id}>
                <div className="progress-card-heading">
                  <span className="course-icon">
                    {getCourseIcon(course.icon)}
                  </span>

                  <div>
                    <h3>{course.title}</h3>
                    <p>
                      {course.completedLessons}/{course.lessons} lessons ·{" "}
                      {course.duration}
                    </p>
                  </div>

                  <strong>{courseProgress(course)}%</strong>
                </div>

                <div className="large-progress-bar">
                  <div style={{ width: `${courseProgress(course)}%` }} />
                </div>

                <small>
                  {courseProgress(course) === 100
                    ? "Course completed — certificate available!"
                    : "Complete more video lessons to increase progress."}
                </small>

                {courseProgress(course) === 100 && (
                  <button
                    className="certificate-button"
                    onClick={() => setShowCertificate(true)}
                  >
                    <FaDownload /> View Certificate
                  </button>
                )}
              </article>
            ))}
          </div>

          <button className="reset-button" onClick={resetDemo}>
            Reset Demo Data
          </button>
        </Page>
      )}

      {activePage === "learn" && learningCourse && (
        <main className="learning-page">
          <section className="learning-topbar">
            <button onClick={() => changePage("courses")}>← Back to Courses</button>
            <div>
              <span>{learningCourse.category}</span>
              <h1>{learningCourse.title}</h1>
              <p>
                {learningCourse.completedLessons}/{learningCourse.lessons} lessons completed ·{" "}
                {courseProgress(learningCourse)}%
              </p>
            </div>
          </section>

          <section className="learning-layout">
            <aside className="lesson-sidebar">
              <div className="lesson-sidebar-heading">
                <h2>Course Content</h2>
                <span>{learningCourse.lessons} lessons</span>
              </div>

              <div className="lesson-list">
                {Array.from({ length: learningCourse.lessons }).map((_, index) => {
                  const completed = index < learningCourse.completedLessons;

                  return (
                    <button
                      key={index}
                      className={`lesson-item ${
                        activeLessonIndex === index ? "active" : ""
                      }`}
                      onClick={() => setActiveLessonIndex(index)}
                    >
                      <span className={completed ? "lesson-check completed" : "lesson-check"}>
                        {completed ? "✓" : index + 1}
                      </span>
                      <div>
                        <strong>{lessonTitle(learningCourse, index)}</strong>
                        <small>{completed ? "Completed" : "8–12 minutes"}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <article className="lesson-reader">
              <div className="lesson-video-demo">
                <FaPlay />
                <span>Lesson {activeLessonIndex + 1} Learning Video</span>
              </div>

              <span className="lesson-label">
                Lesson {activeLessonIndex + 1} of {learningCourse.lessons}
              </span>
              <h2>{lessonTitle(learningCourse, activeLessonIndex)}</h2>
              <p>{lessonContent(learningCourse, activeLessonIndex)}</p>

              <div className="lesson-notes">
                <h3>Key Learning Points</h3>
                <ul>
                  <li>Understand the concept in simple language.</li>
                  <li>Study the example and connect it with the LMS project.</li>
                  <li>Complete the lesson activity before moving ahead.</li>
                  <li>Use the Mark Lesson Complete button to update progress.</li>
                </ul>
              </div>

              <div className="lesson-code">
                <span>Practical Example</span>
                <pre>{`// ${learningCourse.title} lesson example
function completeLesson() {
  return "Lesson completed successfully";
}`}</pre>
              </div>

              <div className="lesson-navigation">
                <button
                  disabled={activeLessonIndex === 0}
                  onClick={() =>
                    setActiveLessonIndex((index) => Math.max(index - 1, 0))
                  }
                >
                  ← Previous-
                </button>

                <button
                  className="complete-lesson-button"
                  onClick={completeCurrentLesson}
                >
                  <FaCheckCircle /> Mark Lesson Complete
                </button>

                <button
                  disabled={activeLessonIndex === learningCourse.lessons - 1}
                  onClick={() =>
                    setActiveLessonIndex((index) =>
                      Math.min(index + 1, learningCourse.lessons - 1)
                    )
                  }
                >
                  Next →
                </button>
              </div>
            </article>
          </section>
        </main>
      )}

      <footer>
        <div>
          <strong>LearnSphere LMS</strong>
          <span>Learn. Practice. Grow.</span>
        </div>
        <p>© 2026 Learning Management System · Developed by Satnam Singh</p>
      </footer>

      {showLogin && (
        <div className="modal-overlay">
          <form className="modal login-modal" onSubmit={handleLogin}>
            <button
              type="button"
              className="close-modal"
              onClick={() => setShowLogin(false)}
            >
              <FaTimes />
            </button>

            <span className="modal-icon">
              <FaGraduationCap />
            </span>
            <h2>Welcome back</h2>
            <p>Login to continue your learning journey.</p>

            <label>
              Email address
              <input
  type="email"
  placeholder="student@lms.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
            </label>

            <label>
              Password
              <input
  type="password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
            </label>

            <button type="submit" className="modal-primary-button">
              Login to LMS
            </button>
          </form>
        </div>
      )}

      {selectedVideo && (
        <div className="modal-overlay">
          <div className="modal video-modal">
            <button
              className="close-modal"
              onClick={() => setSelectedVideo(null)}
            >
              <FaTimes />
            </button>

            <div className="video-player">
              <FaPlay />
              <span>Demo Video Player</span>
            </div>

            <h2>{selectedVideo.title}</h2>
            <p>{selectedVideo.description}</p>
            <span className="video-course-name">
              {selectedVideo.course} · {selectedVideo.duration}
            </span>

            <button
              className="modal-primary-button"
              onClick={() => completeVideo(selectedVideo)}
            >
              Mark as Completed
            </button>
          </div>
        </div>
      )}

      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal course-modal">
            <button
              className="close-modal"
              onClick={() => setSelectedCourse(null)}
            >
              <FaTimes />
            </button>

            <span className="modal-icon">
              {getCourseIcon(selectedCourse.icon)}
            </span>
            <span className="course-category">{selectedCourse.category}</span>
            <h2>{selectedCourse.title}</h2>
            <p>{selectedCourse.description}</p>

            <div className="modal-course-stats">
              <span>{selectedCourse.lessons} lessons</span>
              <span>{selectedCourse.duration}</span>
              <span>{selectedCourse.level}</span>
            </div>

            <button
              className="modal-primary-button"
              onClick={() => {
                setSelectedCourse(null);
                openLearning(selectedCourse.id);
              }}
            >
              {enrolledCourses.includes(selectedCourse.id)
                ? "Continue Learning"
                : "Enroll Now"}
            </button>
          </div>
        </div>
      )}

      {showCertificate && (
        <div className="modal-overlay">
          <div className="modal certificate-modal">
            <button
              className="close-modal"
              onClick={() => setShowCertificate(false)}
            >
              <FaTimes />
            </button>

            <div className="certificate">
              <FaGraduationCap />
              <span>CERTIFICATE OF COMPLETION</span>
              <h2>Satnam Singh</h2>
              <p>has successfully completed a course on LearnSphere LMS.</p>
              <strong>Learning Management System</strong>
              <small>Issued in 2026</small>
            </div>

            <button
              className="modal-primary-button"
              onClick={() => window.print()}
            >
              <FaDownload /> Print / Save Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, enrolled, onEnroll, onLearn, onDetails }) {
  const progress = courseProgress(course);

  return (
    <article className="course-card">
      <div className="course-card-top">
        <span className="course-icon">{getCourseIcon(course.icon)}</span>
        <span className="course-level">{course.level}</span>
      </div>

      <span className="course-category">{course.category}</span>
      <h3>{course.title}</h3>
      <p>{course.description}</p>

      <div className="course-meta">
        <span>
          <FaBookOpen /> {course.lessons} lessons
        </span>
        <span>
          <FaClock /> {course.duration}
        </span>
      </div>

      <div className="course-progress-heading">
        <span>Progress</span>
        <strong>{progress}%</strong>
      </div>

      <div className="course-progress">
        <div style={{ width: `${progress}%` }} />
      </div>

      <div className="course-buttons">
        <button onClick={onDetails}>View Details</button>
        <button
          className="main-course-button"
          onClick={enrolled ? onLearn : onEnroll}
        >
          {enrolled ? "Start Learning" : "Enroll Now"}
        </button>
      </div>
    </article>
  );
}

function Page({ eyebrow, title, description, children }) {
  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
      <section className="page-content">{children}</section>
    </main>
  );
}

function PreviewProgress({ course }) {
  const progress = courseProgress(course);

  return (
    <div className="preview-progress-item">
      <div>
        <span>{course.title}</span>
        <strong>{progress}%</strong>
      </div>
      <div className="preview-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="stat-item">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
