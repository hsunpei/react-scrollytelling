import { ScrollytellingProvider } from "@react-scrollytelling/grouped";
import { StickyContainer } from "@react-scrollytelling/layout";
import { TrackedSection } from "./components/TrackedSection.tsx";
import { ActiveSectionInfo } from "./components/ActiveSectionInfo.tsx";

const SECTIONS = [
  { id: "RED", colorClass: "section-red", isFirst: true },
  { id: "ORANGE", colorClass: "section-orange" },
  { id: "YELLOW", colorClass: "section-yellow" },
  { id: "GREEN", colorClass: "section-green" },
  { id: "BLUE", colorClass: "section-blue" },
  { id: "PURPLE", colorClass: "section-purple", isLast: true },
];

function App() {
  return (
    <ScrollytellingProvider>
      <div style={{ margin: "0.5rem", padding: "3rem 0" }}>
        {/* Spacer at the beginning (longer than 100vh) */}
        <div
          data-testid="spacer-top"
          style={{
            height: "120vh",
            backgroundColor: "#f8fafc",
            border: "2px dashed #cbd5e1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "1rem",
            marginBottom: "2rem",
            padding: "2rem",
            boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2
            style={{
              color: "#64748b",
              marginBottom: "1.5rem",
              fontWeight: 600,
            }}
          >
            Scroll Down to Start Scrollytelling
          </h2>
          <div
            style={{
              padding: "1.5rem",
              background: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ActiveSectionInfo hideTestIds />
          </div>
        </div>

        <StickyContainer
          overlay={
            <>
              {SECTIONS.map((s) => (
                <TrackedSection
                  key={s.id}
                  sectionID={s.id}
                  colorClass={s.colorClass}
                  isFirst={s.isFirst}
                  isLast={s.isLast}
                />
              ))}
            </>
          }
        >
          <ActiveSectionInfo />
        </StickyContainer>

        {/* Spacer at the end (longer than 100vh) */}
        <div
          data-testid="spacer-bottom"
          id="spacer-bottom"
          style={{
            height: "120vh",
            backgroundColor: "#f8fafc",
            border: "2px dashed #cbd5e1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "1rem",
            marginTop: "2rem",
            padding: "2rem",
            boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2
            style={{
              color: "#64748b",
              marginBottom: "1.5rem",
              fontWeight: 600,
            }}
          >
            End of Scrollytelling
          </h2>
          <div
            style={{
              padding: "1.5rem",
              background: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ActiveSectionInfo hideTestIds />
          </div>
        </div>
      </div>
    </ScrollytellingProvider>
  );
}

export default App;
