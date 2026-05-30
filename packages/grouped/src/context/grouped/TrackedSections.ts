import { type SectionScrollInfo } from "@react-scrollytelling/core";

import { type TrackedSectionInfo } from "./ScrollytellingContext";

/** Stores all the sections in the viewport */
export class TrackedSections {
  /** Sections currently in the viewport. Entries are added via setSection and removed via removeSection when the IntersectionObserver fires with isIntersecting=false. Used to gate onNewSectionAdded callbacks. */
  private trackedSections: Map<string, TrackedSectionInfo>;
  /** Registry of all mounted sections. Entries are added via setSection and removed via unregisterSection on unmount. Used by findClosestToBottomId as a fallback when no tracked section is in the viewport. */
  private registeredSections: Map<string, TrackedSectionInfo>;

  /** The ID of the section that is currently closet to the bottom of the viewport */
  private closetSectionId: string | null;

  private onNewSectionAdded?: (sectionID: string) => void;

  constructor({
    onNewSectionAdded,
  }: { onNewSectionAdded?: (sectionID: string) => void } = {}) {
    this.trackedSections = new Map();
    this.registeredSections = new Map();
    this.closetSectionId = null;
    this.onNewSectionAdded = onNewSectionAdded;
  }

  updateOnNewSectionAdded = (
    onNewSectionAdded: (sectionID: string) => void
  ) => {
    this.onNewSectionAdded = onNewSectionAdded;
  };

  getSection = (sectionID: string) => {
    return this.registeredSections.get(sectionID);
  };

  setSection = (sectionID: string, sectionInfo: TrackedSectionInfo) => {
    this.registeredSections.set(sectionID, sectionInfo);
    if (!this.trackedSections.has(sectionID)) {
      this.trackedSections.set(sectionID, sectionInfo);
      this.onNewSectionAdded?.(sectionID);
    } else {
      this.trackedSections.set(sectionID, sectionInfo);
    }
  };

  subscribeScroll = (
    sectionID: string,
    onActiveScroll: (scrollInfo: SectionScrollInfo) => void
  ) => {
    const section = this.registeredSections.get(sectionID);
    if (section) {
      section.onActiveScroll = onActiveScroll;
    }
    const trackedSection = this.trackedSections.get(sectionID);
    if (trackedSection) {
      trackedSection.onActiveScroll = onActiveScroll;
    }
  };

  /** Remove a section from viewport tracking (e.g. when it scrolls out of view). Only removes from trackedSections; the section remains in registeredSections so findClosestToBottomId can still resolve it as a fallback. */
  untrackSection = (sectionID: string) => {
    this.trackedSections.delete(sectionID);

    if (this.closetSectionId === sectionID) {
      this.closetSectionId = null;
    }

    this.onNewSectionAdded?.(sectionID);
  };

  /** Fully unregister a section (e.g. on unmount). Removes from both maps. */
  unregisterSection = (sectionID: string) => {
    this.registeredSections.delete(sectionID);
    this.untrackSection(sectionID);
  };

  has = (sectionID: string) => {
    return this.registeredSections.has(sectionID);
  };

  findClosestToBottomId = (
    scrollTop: number,
    windowHeight: number
  ): string | null => {
    let closestId: string | null = null;
    let minDistance = Infinity;

    // Primary: search sections currently in the viewport
    this.trackedSections.forEach((sectionInfo, sectionID) => {
      const scrollBottom = scrollTop + windowHeight;
      const sectionTop = sectionInfo.sectionTop;
      const distance = scrollBottom - sectionTop;

      if (distance >= 0 && distance < minDistance) {
        minDistance = distance;
        closestId = sectionID;
      }
    });

    if (closestId) {
      return closestId;
    }

    // Fallback: no tracked section is in view (e.g. scrolled into a spacer),
    // select the section whose top is closest to the viewport bottom
    if (this.registeredSections.size > 0) {
      let minAbsDistance = Infinity;
      this.registeredSections.forEach((sectionInfo, sectionID) => {
        const scrollBottom = scrollTop + windowHeight;
        const absDistance = Math.abs(scrollBottom - sectionInfo.sectionTop);

        if (absDistance < minAbsDistance) {
          minAbsDistance = absDistance;
          closestId = sectionID;
        }
      });
    }

    return closestId;
  };

  get closetId() {
    return this.closetSectionId;
  }
}
