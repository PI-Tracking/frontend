import { UUID } from "@Types/Base";
import { Detection } from "@Types/Detection";
import { Report } from "@Types/Report";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import { create } from "zustand";

interface ReportStore {
  report: Report;
  setReport: (newReport: Report) => void;
  addVideoAnalysis: (newAnalysis: VideoAnalysis) => void;
  addDetection: (cameraId: UUID, newDetection: Detection) => void;
}

const useReportStore = create<ReportStore>((set) => ({
  report: {} as Report,

  setReport: (newReport: Report) => set(() => ({ report: newReport })),

  addVideoAnalysis: (newAnalysis: VideoAnalysis) =>
    set((state) => ({
      report: {
        ...state.report,
        uploads: [...state.report.uploads, newAnalysis],
      },
    })),

  addDetection: (cameraId: UUID, newDetection: Detection) => {
    set((state) => {
      const newAnalysis: VideoAnalysis[] = state.report.uploads.map(
        (analysis) => {
          if (analysis.camera.id !== cameraId) {
            return analysis;
          }
          return {
            ...analysis,
            detections: [...analysis.detections, newDetection],
          };
        }
      );

      return {
        report: {
          ...state.report,
          uploads: newAnalysis,
        },
      };
    });
  },
}));

export default useReportStore;
