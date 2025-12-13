import { useState, useEffect } from 'react';
import { MoreVertical, Check } from 'lucide-react';
import { surveyOptions, type SurveyResults } from '@shared/schema';
import {
  Collapsible,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';

export default function SurveySection() {
  const [isOpen, setIsOpen] = useState(true);
  const [surveyResults, setSurveyResults] = useState<SurveyResults>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    // Load local selection preference
    const storedSelection = localStorage.getItem('savingsSelectedOption');
    if (storedSelection) {
      setSelectedOption(storedSelection);
    }

    // Subscribe to real-time updates from Firestore
    const unsubscribe = onSnapshot(doc(db, "surveys", "savings_calculator"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.results) {
          setSurveyResults(data.results as SurveyResults);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleVote = async (optionId: string) => {
    // Update local selection
    setSelectedOption(optionId);
    localStorage.setItem('savingsSelectedOption', optionId);

    // Update global count in Firestore
    const surveyRef = doc(db, "surveys", "savings_calculator");
    try {
      await setDoc(surveyRef, {
        results: { [optionId]: increment(1) }
      }, { merge: true });
    } catch (e) {
      console.error("Error updating vote:", e);
    }
  };

  const totalVotes = Object.values(surveyResults).reduce((sum, votes) => sum + votes, 0);

  return (
    <div className="w-full">
      <div className="relative bg-transparent rounded-2xl shadow-none overflow-visible min-h-[44px] flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-toggle-survey"
          className="absolute top-2 right-2 p-2 transition-colors rounded-lg z-10 hover:bg-slate-100/50 active:bg-slate-200/50 pl-[0px] pr-[0px] pt-[0px] pb-[0px]"
        >
          <MoreVertical className="h-5 w-5 text-[#006044]" />
        </button>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleContent className="px-6 text-[13px] pt-[0px] pb-[0px] pl-[20px] pr-[20px] ml-[10px] mr-[10px]">
            <div className="flex flex-col text-[13px]" style={{ gap: '1.87px' }}>
              {surveyOptions.map(option => {
                const votes = surveyResults[option.id] || 0;
                const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(0) : 0;
                const isSelected = selectedOption === option.id;
                
                return (
                  <div key={option.id} className="flex items-center">
                    <div
                      data-testid={`radio-${option.id}`}
                      onClick={() => handleVote(option.id)}
                      className="border-2 border-foreground bg-transparent flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
                      style={{ width: '18px', height: '18px' }}
                    >
                      {isSelected && (
                        <Check 
                          className="text-primary" 
                          style={{ 
                            width: '22px', 
                            height: '22px',
                            strokeWidth: '4',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3)) drop-shadow(0 0.5px 1px rgba(0,0,0,0.2))',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                          }} 
                        />
                      )}
                    </div>
                    <label 
                      onClick={() => handleVote(option.id)}
                      className="block text-base text-foreground select-none cursor-pointer ml-[10px] mr-[10px]"
                    >
                      {option.fullBold ? (
                        <span className="font-bold">{option.label}</span>
                      ) : option.boldPart ? (
                        <>
                          {option.label.slice(0, -1)}
                          <span className="font-bold">{option.boldPart}</span>
                        </>
                      ) : (
                        option.label
                      )}
                      <span className="ml-2 text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
