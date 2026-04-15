import React, { useState } from "react";

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    level: "Beginner",
    category: "",
    thumbnail: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleImageChange = (e) => {
    setCourseData({ ...courseData, thumbnail: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(courseData);
    // later → send to backend / context
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Add New Course
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        {/* Course Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            required
            placeholder="Enter course title"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Course description"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Price & Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              name="level"
              value={courseData.level}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={courseData.category}
            onChange={handleChange}
            placeholder="e.g. Web Development"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-linear-to-r from-purple-600 to-purple-800 text-white px-8 py-2 rounded-lg hover:scale-105 transition"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;