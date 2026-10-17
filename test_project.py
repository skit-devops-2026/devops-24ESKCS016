import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class TestFSDProject(unittest.TestCase):

    # Core Frontend Pages
    def test_index_html_exists(self):
        self.assertTrue((ROOT / "index.html").is_file(), "index.html must exist")

    def test_jobs_html_exists(self):
        self.assertTrue((ROOT / "jobs.html").is_file(), "jobs.html must exist")

    def test_login_html_exists(self):
        self.assertTrue((ROOT / "login.html").is_file(), "login.html must exist")

    def test_register_html_exists(self):
        self.assertTrue((ROOT / "register.html").is_file(), "register.html must exist")

    def test_job_details_html_exists(self):
        self.assertTrue((ROOT / "job-details.html").is_file(), "job-details.html must exist")

    def test_dashboard_html_exists(self):
        self.assertTrue((ROOT / "dashboard.html").is_file(), "dashboard.html must exist")

    def test_about_html_exists(self):
        self.assertTrue((ROOT / "about.html").is_file(), "about.html must exist")

    def test_contact_html_exists(self):
        self.assertTrue((ROOT / "contact.html").is_file(), "contact.html must exist")

    # Assets & Styles
    def test_main_js_exists(self):
        self.assertTrue((ROOT / "main.js").is_file() or (ROOT / "js" / "main.js").is_file(), "main.js must exist")

    def test_style_css_exists(self):
        self.assertTrue((ROOT / "style.css").is_file() or (ROOT / "css" / "style.css").is_file(), "style.css must exist")

    def test_responsive_css_exists(self):
        self.assertTrue((ROOT / "responsive.css").is_file() or (ROOT / "css" / "responsive.css").is_file(), "responsive.css must exist")

    # Backend & Server
    def test_backend_server_exists(self):
        self.assertTrue((ROOT / "backend" / "server.js").is_file(), "backend/server.js must exist")

    def test_backend_auth_lib_exists(self):
        self.assertTrue((ROOT / "backend" / "lib" / "auth.js").is_file(), "backend/lib/auth.js must exist")

    def test_backend_store_lib_exists(self):
        self.assertTrue((ROOT / "backend" / "lib" / "store.js").is_file(), "backend/lib/store.js must exist")

    # DevOps & Containerization (M4, M5, M6, M7)
    def test_jenkinsfile_exists(self):
        self.assertTrue((ROOT / "Jenkinsfile").is_file(), "Jenkinsfile must exist")

    def test_dockerfile_exists(self):
        self.assertTrue((ROOT / "Dockerfile").is_file(), "Dockerfile must exist")

    def test_docker_compose_exists(self):
        self.assertTrue((ROOT / "docker-compose.yml").is_file(), "docker-compose.yml must exist")

    def test_prometheus_config_exists(self):
        self.assertTrue((ROOT / "monitoring" / "prometheus.yml").is_file(), "monitoring/prometheus.yml must exist")

    def test_grafana_dashboard_exists(self):
        self.assertTrue((ROOT / "monitoring" / "grafana" / "dashboard.json").is_file(), "monitoring/grafana/dashboard.json must exist")

    def test_k8s_deployment_manifest_exists(self):
        self.assertTrue((ROOT / "k8s" / "deployment.yaml").is_file(), "k8s/deployment.yaml must exist")

    def test_k8s_service_manifest_exists(self):
        self.assertTrue((ROOT / "k8s" / "service.yaml").is_file(), "k8s/service.yaml must exist")

    def test_deployment_screenshot_exists(self):
        self.assertTrue((ROOT / "docs" / "deployment-screenshot.png").is_file(), "docs/deployment-screenshot.png must exist")

    # Markup Validation
    def test_index_contains_html(self):
        content = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn("<html", content.lower(), "index.html must contain <html> tag")


if __name__ == "__main__":
    unittest.main()
