// tests/jobs-seed.test.js
const { readDb } = require("../backend/lib/store");

describe("seed job data", () => {
  const db = readDb();

  test("includes at least one job", () => {
    expect(db.jobs.length).toBeGreaterThan(0);
  });

  test("every job has a unique id", () => {
    const ids = db.jobs.map((j) => j.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every job has the required fields", () => {
    db.jobs.forEach((job) => {
      expect(job).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          company: expect.any(String),
          location: expect.any(String),
          type: expect.any(String),
          experience: expect.any(String),
          category: expect.any(String)
        })
      );
    });
  });
});
