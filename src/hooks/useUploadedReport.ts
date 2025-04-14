import { UUID } from "@Types/Base";
import { Detection } from "@Types/Detection";
import { Report } from "@Types/Report";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import { create } from "zustand";

//interface VideoAnalysis {
//  analysis_id: UUID;
//  report_id: UUID;
//  video: string | File;
//  detections: Detection[];
//  currentTimestamp: number; // To save state of what part of video was being watched
//}
//export interface Report {
//  id: UUID;
//  name: string;
//  creator: User;
//  uploads: VideoAnalysis[];
//  createdAt: Date; // datetime
//}

interface ReportStore {
  report: Report;
  setReport: (newReport: Report) => void;
  addVideoAnalysis: (newAnalysis: VideoAnalysis) => void;
}

const useReportStore = create<ReportStore>((set) => ({
  report: {} as Report,

  setReport: (newReport: Report) => set(() => ({ report: newReport })),

  addVideoAnalysis: (newAnalysis: VideoAnalysis) =>
    set((state) => ({
      ...state,
      report: {
        ...state.report,
        uploads: [...state.report.uploads, newAnalysis],
      },
    })),

  addDetection: (cameraId: UUID, newDetection: Detection) => {
    set((state) => {
      const newAnalysis = state.report.uploads.map((analysis) => {
        if (analysis.camera_id !== cameraId) {
          return analysis;
        }
        return {
          ...analysis,
          detections: [...analysis.detections, newDetection],
        };
      });

      return {
        ...state,
        report: {
          ...state.report,
          uploads: [...state.report.uploads, newAnalysis],
        },
      };
    });
  },
}));

export default useReportStore;
