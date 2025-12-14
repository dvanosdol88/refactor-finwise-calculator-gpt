import { useState, useEffect } from 'react';
import { MoreVertical, Check } from 'lucide-react';
import { surveyOptions, type SurveyResults } from '@shared/schema';
import {
  Collapsible,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';

type SurveySectionProps = {
  ui?: "legacy" | "finwise";
};

export default function SurveySection({ ui = "legacy" }: SurveySectionProps) {
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
      <div
        className={
          ui === "finwise"
            ? "relative rounded-2xl border border-border bg-background/60 shadow-sm overflow-visible min-h-[44px] flex items-center"
            : "relative bg-transparent rounded-2xl shadow-none overflow-visible min-h-[44px] flex items-center"
        }
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-toggle-survey"
          className={
            ui === "finwise"
              ? "absolute top-2 right-2 p-2 transition-colors rounded-lg z-10 text-muted-foreground hover:text-foreground hover:bg-muted/40 active:bg-muted/60"
              : "absolute top-2 right-2 p-2 transition-colors rounded-lg z-10 hover:bg-slate-100/50 active:bg-slate-200/50 pl-[0px] pr-[0px] pt-[0px] pb-[0px]"
          }
        >
          <MoreVertical className={ui === "finwise" ? "h-5 w-5" : "h-5 w-5 text-[#006044]"} />
        </button>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleContent
            className={
              ui === "finwise"
                ? "px-4 py-3"
                : "px-6 text-[13px] pt-[0px] pb-[0px] pl-[20px] pr-[20px] ml-[10px] mr-[10px]"
            }
          >
            {ui === "finwise" ? (
              <fieldset className="grid gap-2" aria-label="Quick poll">
                {surveyOptions.map((option) => {
                  const votes = surveyResults[option.id] || 0;
                  const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(0) : "0";
                  const isSelected = selectedOption === option.id;

                  return (
                    <label
                      key={option.id}
                      className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/50 px-3 py-2 cursor-pointer transition-colors hover:bg-muted/40"
                    >
                      <input
                        type="radio"
                        name="savings-survey"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleVote(option.id)}
                        className="sr-only peer"
                        data-testid={`radio-${option.id}`}
                      />

                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background peer-checked:border-primary peer-checked:bg-primary/10">
                        <Check className="h-4 w-4 text-primary opacity-0 peer-checked:opacity-100" />
                      </span>

                      <span className="block leading-snug text-foreground">
                        {option.fullBold ? (
                          <span className="font-semibold">{option.label}</span>
                        ) : option.boldPart ? (
                          <>
                            {option.label.slice(0, -1)}
                            <span className="font-semibold">{option.boldPart}</span>
                          </>
                        ) : (
                          option.label
                        )}
                        <span className="ml-2 text-muted-foreground">({percentage}%)</span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            ) : (
              <div className="flex flex-col text-[13px]" style={{ gap: '1.87px' }}>
                {surveyOptions.map(option => {
                  const votes = surveyResults[option.id] || 0;
                  const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(0) : "0";
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
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
