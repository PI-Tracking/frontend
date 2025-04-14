import { UUID } from "@Types/Base";
import { Detection } from "@Types/Detection";
import { Report } from "@Types/Report";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import { create } from "zustand";

interface ReportStore {
  report: Report;
  setReport: (newReport: Report) => void;
  addVideoAnalysis: (newAnalysis: VideoAnalysis) => void;
  addDetection: (analysisId: UUID, newDetection: Detection) => void;
  addDetections: (analysisId: UUID, newDetections: Detection[]) => void;
  setDetections: (analysisId: UUID, newDetections: Detection[]) => void;
  setCurrentTime: (analysisId: UUID, newDetectionTime: number) => void;
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

  setCurrentTime: (analysisId: UUID, newCurrentTime: number) =>
    set((state) => {
      const newAnalysis: VideoAnalysis[] = state.report.uploads.map(
        (analysis) => {
          if (analysis.analysis_id !== analysisId) {
            return analysis;
          }
          return {
            ...analysis,
            currentTimestamp: newCurrentTime,
          };
        }
      );

      return {
        report: {
          ...state.report,
          uploads: newAnalysis,
        },
      };
    }),

  addDetection: (analysisId: UUID, newDetection: Detection) => {
    set((state) => {
      const newAnalysis: VideoAnalysis[] = state.report.uploads.map(
        (analysis) => {
          if (analysis.analysis_id !== analysisId) {
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

  addDetections: (analysisId: UUID, newDetections: Detection[]) => {
    set((state) => {
      const newAnalysis: VideoAnalysis[] = state.report.uploads.map(
        (analysis) => {
          if (analysis.analysis_id !== analysisId) {
            return analysis;
          }
          return {
            ...analysis,
            detections: [...analysis.detections, ...newDetections],
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

  setDetections: (analysisId: UUID, newDetections: Detection[]) => {
    set((state) => {
      const newAnalysis: VideoAnalysis[] = state.report.uploads.map(
        (analysis) => {
          if (analysis.analysis_id !== analysisId) {
            return analysis;
          }
          return {
            ...analysis,
            detections: newDetections,
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
