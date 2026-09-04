import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { EvolutionStage } from '../types/pokemon';

interface EvolutionChainProps {
  stages: EvolutionStage[];
  currentId: number;
  onSelectPokemon: (id: number) => void;
}

export const EvolutionChain: React.FC<EvolutionChainProps> = ({
  stages,
  currentId,
  onSelectPokemon,
}) => {
  if (!stages || stages.length === 0) {
    return (
      <div className="empty-state">
        <p>Sem informações de evolução disponíveis para este Pokémon.</p>
      </div>
    );
  }

  if (stages.length === 1) {
    return (
      <div className="empty-state">
        <p>Este Pokémon não possui linha evolutiva conhecida.</p>
      </div>
    );
  }

  return (
    <div className="evolution-flow">
      {stages.map((stage, index) => {
        const isCurrent = stage.id === currentId;
        const formattedId = `#${String(stage.id).padStart(4, '0')}`;

        return (
          <React.Fragment key={`${stage.id}-${index}`}>
            <div
              className={`evolution-stage-card ${isCurrent ? 'current' : ''}`}
              onClick={() => onSelectPokemon(stage.id)}
              role="button"
              tabIndex={0}
              title={`Ver detalhes de ${stage.name}`}
            >
              <img src={stage.sprite} alt={stage.name} loading="lazy" />
              <span className="evolution-stage-name">{stage.name}</span>
              <span className="evolution-stage-id">{formattedId}</span>
            </div>

            {index < stages.length - 1 && (
              <div className="evolution-arrow-container">
                <ChevronRight size={24} />
                {stages[index + 1]?.minLevel && (
                  <span className="evolution-trigger-badge">
                    Nv. {stages[index + 1].minLevel}
                  </span>
                )}
                {stages[index + 1]?.item && (
                  <span className="evolution-trigger-badge">
                    {stages[index + 1].item?.replace(/-/g, ' ')}
                  </span>
                )}
                {stages[index + 1]?.triggerName &&
                  !stages[index + 1]?.minLevel &&
                  !stages[index + 1]?.item && (
                    <span className="evolution-trigger-badge">
                      {stages[index + 1].triggerName?.replace(/-/g, ' ')}
                    </span>
                  )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
