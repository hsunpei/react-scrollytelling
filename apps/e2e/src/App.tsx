import { ScrollytellingProvider } from '@react-scrollytelling/grouped';
import { StickyContainer } from '@react-scrollytelling/layout';
import { TrackedSection } from './components/TrackedSection.tsx';
import { ActiveSectionInfo } from './components/ActiveSectionInfo.tsx';

const SECTIONS = [
  { id: 'RED', colorClass: 'section-red', isFirst: true },
  { id: 'ORANGE', colorClass: 'section-orange' },
  { id: 'YELLOW', colorClass: 'section-yellow' },
  { id: 'GREEN', colorClass: 'section-green' },
  { id: 'BLUE', colorClass: 'section-blue' },
  { id: 'PURPLE', colorClass: 'section-purple', isLast: true },
];

function App() {
  return (
    <div style={{ margin: '0.5rem', padding: '3rem 0' }}>
      <ScrollytellingProvider>
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
      </ScrollytellingProvider>
    </div>
  );
}

export default App;
