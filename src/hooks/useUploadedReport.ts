import { Report } from "@Types/Report";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import { create } from "zustand";

//interface VideoAnalysis {
//  id: UUID;
//  camera: Camera;
//  video: string;
//  currentTimestamp: number; // To save state of what part of video was being watched
//  detections: Detection[];
//}
//export interface Report {
//  id: UUID;
//  name: string;
//  creator: User;
//  uploads: VideoAnalysis[];
//  createdAt: Date; // datetime
//}

interface ReportState {
  report: Report;
  setReport: (newReport: Report) => void;
  addVideoAnalysis: (newAnalysis: VideoAnalysis) => void;
}
const useReport = create<ReportState>((set) => ({
  report: {} as Report,

  setReport: (newReport: Report) => set(() => ({ report: newReport })),

  addVideoAnalysis: (newAnalysis: VideoAnalysis) =>
    set((state) => ({
      report: {
        ...state.report,
        uploads: [...state.report.uploads, newAnalysis],
      },
    })),
}));

export default useReport;
