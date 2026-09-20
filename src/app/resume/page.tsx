import ResumeView from "./resume-view";
import { config } from "@/data/config";

export const metadata = {
  title: `Résumé | ${config.author}`,
  description:
    `Official résumé of ${config.fullName} — Computer Science & Information Security student at VIT Vellore. View online or download the PDF.`,
};

export default function ResumePage() {
  return <ResumeView />;
}
