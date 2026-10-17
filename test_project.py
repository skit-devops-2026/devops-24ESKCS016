import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class TestFSDProject(unittest.TestCase):

    def test_index_html_exists(self):
        self.assertTrue((ROOT / "index.html").is_file(), "index.html must exist")

    def test_jobs_html_exists(self):
        self.assertTrue((ROOT / "jobs.html").is_file(), "jobs.html must exist")

    def test_login_html_exists(self):
        self.assertTrue((ROOT / "login.html").is_file(), "login.html must exist")

    def test_register_html_exists(self):
        self.assertTrue((ROOT / "register.html").is_file(), "register.html must exist")

    def test_main_js_exists(self):
        self.assertTrue((ROOT / "main.js").is_file(), "main.js must exist")

    def test_style_css_exists(self):
        self.assertTrue((ROOT / "style.css").is_file(), "style.css must exist")

    def test_responsive_css_exists(self):
        self.assertTrue((ROOT / "responsive.css").is_file(), "responsive.css must exist")

    def test_index_contains_html(self):
        content = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn("<html", content.lower(), "index.html must contain <html> tag")


if __name__ == "__main__":
    unittest.main()
