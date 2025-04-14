import { UUID } from "@Types/Base";
import { Detection } from "@Types/Detection";
import { Report } from "@Types/Report";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import { create } from "zustand";

interface ReportStore {
  report: Report;
  setReport: (newReport: Report) => void;
  setInitialAnalysisId: (analysisId: UUID) => void;

  addVideoAnalysis: (newAnalysis: VideoAnalysis) => void;

  // TODO meter tambem com analysis_id
  addDetection: (videoId: UUID, newDetection: Detection) => void;
  addDetections: (videoId: UUID, newDetections: Detection[]) => void;

  setDetections: (
    video_id: UUID,
    analysis_id: UUID,
    newDetections: Detection[]
  ) => void;

  setCurrentTime: (videoId: UUID, newDetectionTime: number) => void;
}

const useReportStore = create<ReportStore>((set) => ({
  report: {} as Report,

  setReport: (newReport: Report) => set(() => ({ report: newReport })),

  setInitialAnalysisId: (analysisId: UUID) =>
    set((state) => ({
      report: {
        ...state.report,
        uploads: state.report.uploads.map((upload) => ({
          ...upload,
          analysis_id: analysisId,
        })),
      },
    })),

  addVideoAnalysis: (newAnalysis: VideoAnalysis) =>
    set((state) => ({
      report: {
        ...state.report,
        uploads: [...state.report.uploads, newAnalysis],
      },
    })),

  setCurrentTime: (videoId: UUID, newCurrentTime: number) =>
    set((state) => {
      const newAnalysis: VideoAnalysis[] = state.report.uploads.map(
        (analysis) => {
          if (analysis.video_id !== videoId) {
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

  addDetection: (videoId: UUID, newDetection: Detection) => {
    set((state) => {
      const newAnalysis: VideoAnalysis[] = state.report.uploads.map(
        (analysis) => {
          if (analysis.video_id !== videoId) {
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

  addDetections: (videoId: UUID, newDetections: Detection[]) => {
    set((state) => {
      const newAnalysis: VideoAnalysis[] = state.report.uploads.map(
        (analysis) => {
          if (analysis.video_id !== videoId) {
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

  setDetections: (
    video_id: UUID,
    analysis_id: UUID,
    newDetections: Detection[]
  ) => {
    set((state) => {
      const newAnalysis: VideoAnalysis[] = state.report.uploads.map(
        (analysis) => {
          if (
            analysis.video_id !== video_id ||
            analysis.analysis_id !== analysis_id
          ) {
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
