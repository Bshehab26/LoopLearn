import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const EditCourse = () => {
  const { id } = useParams();
  const {
    instructorCourses,
    currency,
    navigate,
    updateInstructorCourse,
  } = useContext(AppContext);

  const [formData, setFormData] = useState({
    courseTitle: "",
    coursePrice: "",
    courseDescription: "",
  });

  /* =====================
     LOAD COURSE (DUMMY SAFE)
  ====================== */
  useEffect(() => {
    if (!instructorCourses.length) return;

    const course = instructorCourses.find(
      (c) => String(c._id) === String(id)
    );

    if (!course) {
      navigate("/instructor/my-courses");
      return;
    }

    setFormData({
      courseTitle: course.courseTitle || "",
      coursePrice: course.coursePrice || "",
      courseDescription: course.courseDescription || "",
    });
  }, [id, instructorCourses, navigate]);

  /* =====================
     CHANGE
  ====================== */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =====================
     SUBMIT (LOCAL UPDATE)
  ====================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    updateInstructorCourse(id, {
      courseTitle: formData.courseTitle,
      coursePrice: Number(formData.coursePrice),
      courseDescription: formData.courseDescription,
    });

    alert("Course updated (dummy) ✅");
    navigate("/instructor/my-courses");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Course Title</label>
          <input
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Price ({currency})
          </label>
          <input
            type="number"
            name="coursePrice"
            value={formData.coursePrice}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="courseDescription"
            value={formData.courseDescription}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
        </div>

        <div className="flex gap-3">
          <button className="bg-purple-600 text-white px-6 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;