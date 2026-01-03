import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const cohortService = {
  getAll: async () => {
    const response = await api.get("/cohorts");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cohorts/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/cohorts", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/cohorts/${id}`, data);
    return response.data;
  },

  getRoster: async (id) => {
    const response = await api.get(`/cohorts/${id}/roster`);
    return response.data;
  },

  importInterns: async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/cohorts/${id}/import`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export const assessmentService = {
  getAll: async () => {
    const response = await api.get("/assessments");
    return response.data;
  },

  getAvailable: async (cohortId) => {
    const response = await api.get(
      `/assessments/available?cohort_id=${cohortId}`
    );
    return response.data;
  },

  getTasks: async (assessmentId) => {
    const response = await api.get(`/tasks?assessment_id=${assessmentId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/assessments", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/assessments/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  },
};

export const taskService = {
  create: async (data) => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  reorder: async (id, newOrder) => {
    const response = await api.patch(`/tasks/${id}/reorder`, {
      order_index: newOrder,
    });
    return response.data;
  },
};

export const windowService = {
  getWindows: async (cohortId) => {
    const response = await api.get(`/assessment_windows?cohort_id=${cohortId}`);
    return response.data;
  },

  createWindow: async (data) => {
    const response = await api.post("/assessment_windows", data);
    return response.data;
  },

  updateVisibility: async (id, visible) => {
    const response = await api.patch(`/assessment_windows/${id}/visibility`, {
      visible,
    });
    return response.data;
  },

  updateSchedule: async (id, opens_at, closes_at) => {
    const response = await api.patch(`/assessment_windows/${id}/schedule`, {
      opens_at,
      closes_at,
    });
    return response.data;
  },

  updateLock: async (id, locked) => {
    const response = await api.patch(`/assessment_windows/${id}/lock`, {
      locked,
    });
    return response.data;
  },
};

export const overrideService = {
  getOverrides: async (cohortId, assessmentId) => {
    const response = await api.get(
      `/access_overrides?cohort_id=${cohortId}&assessment_id=${assessmentId}`
    );
    return response.data;
  },

  createOverride: async (data) => {
    const response = await api.post("/access_overrides", data);
    return response.data;
  },

  deleteOverride: async (id) => {
    const response = await api.delete(`/access_overrides/${id}`);
    return response.data;
  },
};

export const submissionService = {
  start: async (assessmentId, cohortId) => {
    const response = await api.post("/submissions/start", {
      assessment_id: assessmentId,
      cohort_id: cohortId,
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/submissions/${id}`, data);
    return response.data;
  },

  uploadFile: async (id, taskId, file) => {
    console.log("📤 submissionService.uploadFile called");
    console.log("  Submission ID:", id);
    console.log("  Task ID:", taskId);
    console.log("  File:", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("task_id", taskId);

    console.log(
      "📦 FormData created, sending PATCH request to /submissions/" + id
    );

    try {
      const response = await api.patch(`/submissions/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ PATCH response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ PATCH request failed:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    }
  },

  submitText: async (id, text) => {
    console.log("📤 submissionService.submitText called");
    console.log("  Submission ID:", id);
    console.log("  Text length:", text.length);

    const formData = new FormData();
    formData.append("submission_text", text);

    try {
      const response = await api.patch(`/submissions/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ PATCH response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ PATCH request failed:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    }
  },

  timeout: async (id) => {
    const response = await api.post(`/submissions/${id}/timeout`);
    return response.data;
  },

  getSubmissions: async (cohortId, assessmentId = null) => {
    let url = `/submissions?cohort_id=${cohortId}`;
    if (assessmentId) url += `&assessment_id=${assessmentId}`;
    const response = await api.get(url);
    return response.data;
  },
};

export const scoreService = {
  createScore: async (data) => {
    const response = await api.post("/scores", data);
    return response.data;
  },

  getSummary: async (cohortId) => {
    const response = await api.get(`/scores/summary?cohort_id=${cohortId}`);
    return response.data;
  },
};

export const snapshotService = {
  capture: async (assessmentId, imageBlob) => {
    const formData = new FormData();
    formData.append("assessment_id", assessmentId);
    formData.append("image", imageBlob, "snapshot.jpg");
    const response = await api.post("/snapshots", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getSnapshots: async (cohortId, assessmentId) => {
    const response = await api.get(
      `/snapshots?cohort_id=${cohortId}&assessment_id=${assessmentId}`
    );
    return response.data;
  },
};

export const userService = {
  create: async (data) => {
    const response = await api.post("/users", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },
};
