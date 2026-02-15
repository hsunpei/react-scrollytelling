import {
  ActiveSectionObserver,
  ActiveSectionScrollInfo,
} from "./ScrollytellingContext";

export class ActiveSectionObservable {
  private observers: Set<ActiveSectionObserver>;

  constructor() {
    this.observers = new Set();
  }

  subscribe = (obs: ActiveSectionObserver) => {
    this.observers.add(obs);
  };

  unsubscribe = (obs: ActiveSectionObserver) => {
    this.observers.delete(obs);
  };

  notify = (data: ActiveSectionScrollInfo) => {
    this.observers.forEach((observer) => observer(data));
  };
}
