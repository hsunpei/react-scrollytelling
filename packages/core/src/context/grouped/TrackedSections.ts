import { TrackedSectionInfo } from './ScrollytellingContext';
import { SectionScrollInfo } from '../../hooks';

/** Stores all the sections in the viewport */
export class TrackedSections {
  private trackedSections: Map<string, TrackedSectionInfo>;

  /** The ID of the section that is currently closet to the bottom of the viewport */
  private closetSectionId: string | null;

  constructor() {
    this.trackedSections = new Map();
    this.closetSectionId = null;
  }

  getSection = (sectionID: string) => {
    return this.trackedSections.get(sectionID);
  };

  setSection = (sectionID: string, sectionInfo: TrackedSectionInfo) => {
    this.trackedSections.set(sectionID, sectionInfo);
  };

  subscribeScroll = (
    sectionID: string,
    onActiveScroll: (scrollInfo: SectionScrollInfo) => void
  ) => {
    const section = this.trackedSections.get(sectionID);
    if (section) {
      section.onActiveScroll = onActiveScroll;
    }
  };

  removeSection = (sectionID: string) => {
    this.trackedSections.delete(sectionID);

    if (this.closetSectionId === sectionID) {
      this.closetSectionId = null;
    }
  };

  has = (sectionID: string) => {
    return this.trackedSections.has(sectionID);
  };

  findClosestToBottomId = (scrollTop: number, windowHeight: number): string | null => {
    let closestId: string | null = null;
    let minDistance = Infinity;

    this.trackedSections.forEach((sectionInfo, sectionID) => {
      const scrollBottom = scrollTop + windowHeight;
      const sectionTop = sectionInfo.sectionTop;
      const distance = scrollBottom - sectionTop;

      if (distance >= 0 && distance < minDistance) {
        minDistance = distance;
        closestId = sectionID;
      }
    });

    return closestId;
  };

  get closetId() {
    return this.closetSectionId;
  }
}