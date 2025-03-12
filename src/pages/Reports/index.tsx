import { useState } from "react";
import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";
import "./ReportsPage.css";

function ReportsPage() {
  const [activeTab, setActiveTab] = useState("weapon");

  const weaponReports = [
    {
      id: 132,
      location: "Rua do Mac",
      reviewers: [
        { id: 1, initial: "A", color: "grey" },
        { id: 2, initial: "A", color: "grey" },
      ],
    },
    {
      id: 133,
      location: "Rua do Mac",
      reviewers: [
        { id: 1, initial: "A", color: "grey" },
        { id: 2, initial: "A", color: "grey" },
      ],
    },
  ];

  return (
    <div className="container">
      <Navbar />
      <section className="reports-section">
        <h1 className="reports-title">Reports</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "weapon" ? "active" : ""}`}
            onClick={() => setActiveTab("weapon")}
          >
            Weapon Detections
          </button>
          <button
            className={`tab ${activeTab === "other" ? "active" : ""}`}
            onClick={() => setActiveTab("other")}
          >
            Other reports
          </button>
        </div>

        <div className="reports-content">
          {activeTab === "weapon" && (
            <div className="reports-list">
              {weaponReports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-info">
                    <div className="report-id">{report.id}</div>
                    <div className="report-location">{report.location}</div>
                  </div>
                  <div className="report-reviewers">
                    <div className="reviewer-label">Reviewed by</div>
                    <div className="reviewer-avatars">
                      {report.reviewers.map((reviewer) => (
                        <div
                          key={reviewer.id}
                          className="reviewer-avatar"
                          style={{ backgroundColor: reviewer.color }}
                        >
                          {reviewer.initial}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "other" && (
            <div className="reports-list">
              <p>Other repotrs will be displayed here</p>
            </div>
          )}
        </div>
      </section>

      <div className="menu-options">
        <CameraMenuOptions />
      </div>
    </div>
  );
}

export default ReportsPage;
